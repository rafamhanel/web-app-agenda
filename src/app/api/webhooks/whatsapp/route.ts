import { NextRequest, NextResponse } from 'next/server'
import { processWhatsAppWebhook, validateWhatsAppWebhook, sendWhatsAppMessage, markMessageAsRead } from '@/lib/whatsapp'
import { generateAIResponse, analyzeMessageIntent, extractAppointmentInfo } from '@/lib/ai-assistant'
import { createCalendarEvent, findAvailableSlots } from '@/lib/google-calendar'
import { supabase } from '@/lib/supabase'

// Verificação do webhook (GET)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (!mode || !token || !challenge) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const validatedChallenge = validateWhatsAppWebhook(mode, token, challenge)

  if (validatedChallenge) {
    return new NextResponse(validatedChallenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
}

// Receber mensagens (POST) - AUTOMAÇÃO COMPLETA COM IA
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Processar webhook
    const messageData = processWhatsAppWebhook(body)

    if (!messageData) {
      return NextResponse.json({ status: 'no_message' })
    }

    const { from, messageText, messageId } = messageData

    // Buscar usuário pelo número de WhatsApp
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('whatsapp', from)
      .single()

    if (!user) {
      console.log('Usuário não encontrado para o número:', from)
      return NextResponse.json({ status: 'user_not_found' })
    }

    // Salvar mensagem recebida no banco
    await supabase.from('messages').insert({
      user_id: user.id,
      client_phone: from,
      message: messageText,
      is_from_client: true,
      is_automated: false,
    })

    // Buscar histórico de conversas (últimas 20 mensagens)
    const { data: conversationHistory } = await supabase
      .from('messages')
      .select('*')
      .eq('client_phone', from)
      .order('created_at', { ascending: true })
      .limit(20)

    // Formatar histórico para a IA
    const formattedHistory = conversationHistory?.map(msg => ({
      role: msg.is_from_client ? 'user' as const : 'assistant' as const,
      content: msg.message,
    })) || []

    // Analisar intenção da mensagem com IA
    const intent = await analyzeMessageIntent(messageText)
    console.log('Intenção detectada:', intent)

    let aiResponse = ''
    let appointmentCreated = false

    // Processar baseado na intenção detectada
    if (intent.intent === 'agendar' && intent.confidence > 0.7) {
      // Cliente quer agendar
      const appointmentInfo = await extractAppointmentInfo(messageText)
      
      if (appointmentInfo.date && appointmentInfo.time) {
        // Cliente especificou data e hora - criar agendamento
        const startTime = new Date(`${appointmentInfo.date}T${appointmentInfo.time}`)
        const endTime = new Date(startTime)
        endTime.setMinutes(endTime.getMinutes() + user.appointment_duration)

        try {
          // Criar evento no Google Calendar
          const event = await createCalendarEvent(
            user.google_calendar_token,
            {
              summary: `Atendimento - ${appointmentInfo.clientName || 'Cliente'}`,
              description: `Cliente: ${from}\nAgendado via WhatsApp automaticamente`,
              start: startTime,
              end: endTime,
            }
          )

          // Salvar agendamento no banco
          await supabase.from('appointments').insert({
            user_id: user.id,
            client_name: appointmentInfo.clientName || 'Cliente',
            client_phone: from,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            status: 'confirmed',
            google_event_id: event.id,
          })

          appointmentCreated = true
          
          // Resposta de confirmação personalizada
          const dateFormatted = startTime.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            day: '2-digit', 
            month: 'long' 
          })
          const timeFormatted = startTime.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })

          aiResponse = `Perfeito! ✅ Seu horário está confirmado para ${dateFormatted} às ${timeFormatted}. Te espero! 😊`
        } catch (error) {
          console.error('Erro ao criar agendamento:', error)
          aiResponse = 'Desculpe, não consegui confirmar esse horário. Pode me passar outra opção?'
        }
      } else {
        // Cliente quer agendar mas não especificou data/hora
        // Buscar horários disponíveis automaticamente
        const availableSlots = await findAvailableSlots(
          user.google_calendar_token,
          user.business_hours_start,
          user.business_hours_end,
          user.appointment_duration,
          7 // próximos 7 dias
        )

        if (availableSlots.length > 0) {
          const formattedSlots = availableSlots.slice(0, 3).map((slot, index) => {
            const date = slot.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: '2-digit', 
              month: 'long' 
            })
            const time = slot.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
            return `${index + 1}. ${date} às ${time}`
          }).join('\n')

          aiResponse = `Tenho esses horários disponíveis:\n\n${formattedSlots}\n\nQual funciona melhor pra você?`
        } else {
          aiResponse = 'No momento não tenho horários disponíveis nos próximos dias. Posso te avisar quando abrir uma vaga?'
        }
      }
    } else if (intent.intent === 'cancelar' && intent.confidence > 0.7) {
      // Cliente quer cancelar
      const { data: appointment } = await supabase
        .from('appointments')
        .select('*')
        .eq('client_phone', from)
        .eq('user_id', user.id)
        .eq('status', 'confirmed')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(1)
        .single()

      if (appointment) {
        await supabase
          .from('appointments')
          .update({ status: 'cancelled' })
          .eq('id', appointment.id)

        aiResponse = 'Seu agendamento foi cancelado com sucesso. Se precisar remarcar, é só me avisar! 😊'
      } else {
        aiResponse = 'Não encontrei nenhum agendamento ativo no seu nome. Quer marcar um horário?'
      }
    } else if (intent.intent === 'reagendar' && intent.confidence > 0.7) {
      // Cliente quer reagendar
      const { data: appointment } = await supabase
        .from('appointments')
        .select('*')
        .eq('client_phone', from)
        .eq('user_id', user.id)
        .eq('status', 'confirmed')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(1)
        .single()

      if (appointment) {
        const availableSlots = await findAvailableSlots(
          user.google_calendar_token,
          user.business_hours_start,
          user.business_hours_end,
          user.appointment_duration,
          7
        )

        if (availableSlots.length > 0) {
          const formattedSlots = availableSlots.slice(0, 3).map((slot, index) => {
            const date = slot.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: '2-digit', 
              month: 'long' 
            })
            const time = slot.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
            return `${index + 1}. ${date} às ${time}`
          }).join('\n')

          aiResponse = `Sem problemas! Tenho esses horários disponíveis:\n\n${formattedSlots}\n\nQual prefere?`
        } else {
          aiResponse = 'No momento não tenho outros horários disponíveis. Posso te avisar quando abrir uma vaga?'
        }
      } else {
        aiResponse = 'Não encontrei nenhum agendamento ativo no seu nome. Quer marcar um horário novo?'
      }
    } else {
      // Para outras intenções, usar IA personalizada
      aiResponse = await generateAIResponse(user.id, messageText, formattedHistory)
    }

    // Enviar resposta automaticamente
    await sendWhatsAppMessage(from, aiResponse, user.whatsapp_token)

    // Salvar resposta no banco
    await supabase.from('messages').insert({
      user_id: user.id,
      client_phone: from,
      message: aiResponse,
      is_from_client: false,
      is_automated: true,
    })

    // Marcar mensagem como lida
    await markMessageAsRead(messageId, user.whatsapp_token)

    return NextResponse.json({ 
      status: 'success',
      intent: intent.intent,
      appointmentCreated,
      response: aiResponse,
    })
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
