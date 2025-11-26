import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateAIResponse, analyzeMessageIntent, extractAppointmentInfo } from '@/lib/ai-assistant'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import { createCalendarEvent, findAvailableSlots } from '@/lib/google-calendar'

// Processar mensagem com automação completa
export async function POST(request: NextRequest) {
  try {
    const { userId, clientPhone, message } = await request.json()

    if (!userId || !clientPhone || !message) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // Buscar usuário
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Buscar histórico de conversas
    const { data: conversationHistory } = await supabase
      .from('messages')
      .select('*')
      .eq('client_phone', clientPhone)
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(20)

    // Formatar histórico
    const formattedHistory = conversationHistory?.map(msg => ({
      role: msg.is_from_client ? 'user' as const : 'assistant' as const,
      content: msg.message,
    })) || []

    // Analisar intenção
    const intent = await analyzeMessageIntent(message)
    console.log('Intenção detectada:', intent)

    // Processar baseado na intenção
    let aiResponse = ''
    let appointmentCreated = false

    if (intent.intent === 'agendar' && intent.confidence > 0.7) {
      // Extrair informações de agendamento
      const appointmentInfo = await extractAppointmentInfo(message)
      
      if (appointmentInfo.date && appointmentInfo.time) {
        // Cliente especificou data e hora
        const startTime = new Date(`${appointmentInfo.date}T${appointmentInfo.time}`)
        const endTime = new Date(startTime)
        endTime.setMinutes(endTime.getMinutes() + user.appointment_duration)

        try {
          // Criar evento no Google Calendar
          const event = await createCalendarEvent(
            user.google_calendar_token,
            {
              summary: `Atendimento - ${appointmentInfo.clientName || 'Cliente'}`,
              description: `Cliente: ${clientPhone}\nAgendado via WhatsApp`,
              start: startTime,
              end: endTime,
            }
          )

          // Salvar no banco
          await supabase.from('appointments').insert({
            user_id: userId,
            client_name: appointmentInfo.clientName || 'Cliente',
            client_phone: clientPhone,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            status: 'confirmed',
            google_event_id: event.id,
          })

          appointmentCreated = true
          aiResponse = `Perfeito! Seu horário está confirmado para ${startTime.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            day: '2-digit', 
            month: 'long' 
          })} às ${startTime.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}. Te espero! 😊`
        } catch (error) {
          console.error('Erro ao criar agendamento:', error)
          aiResponse = 'Desculpe, não consegui confirmar esse horário. Pode me passar outra opção?'
        }
      } else {
        // Cliente quer agendar mas não especificou data/hora
        // Buscar horários disponíveis
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

          aiResponse = `Tenho esses horários disponíveis:\n\n${formattedSlots}\n\nQual funciona melhor pra você?`
        } else {
          aiResponse = 'No momento não tenho horários disponíveis nos próximos dias. Posso te avisar quando abrir uma vaga?'
        }
      }
    } else if (intent.intent === 'cancelar' && intent.confidence > 0.7) {
      // Buscar agendamento ativo do cliente
      const { data: appointment } = await supabase
        .from('appointments')
        .select('*')
        .eq('client_phone', clientPhone)
        .eq('user_id', userId)
        .eq('status', 'confirmed')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(1)
        .single()

      if (appointment) {
        // Cancelar agendamento
        await supabase
          .from('appointments')
          .update({ status: 'cancelled' })
          .eq('id', appointment.id)

        aiResponse = 'Seu agendamento foi cancelado. Se precisar remarcar, é só me avisar! 😊'
      } else {
        aiResponse = 'Não encontrei nenhum agendamento ativo no seu nome. Quer marcar um horário?'
      }
    } else if (intent.intent === 'reagendar' && intent.confidence > 0.7) {
      // Buscar agendamento ativo
      const { data: appointment } = await supabase
        .from('appointments')
        .select('*')
        .eq('client_phone', clientPhone)
        .eq('user_id', userId)
        .eq('status', 'confirmed')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(1)
        .single()

      if (appointment) {
        // Buscar novos horários
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
      // Gerar resposta com IA para outras intenções
      aiResponse = await generateAIResponse(userId, message, formattedHistory)
    }

    // Salvar mensagem do cliente
    await supabase.from('messages').insert({
      user_id: userId,
      client_phone: clientPhone,
      message: message,
      is_from_client: true,
      is_automated: false,
    })

    // Salvar resposta da IA
    await supabase.from('messages').insert({
      user_id: userId,
      client_phone: clientPhone,
      message: aiResponse,
      is_from_client: false,
      is_automated: true,
    })

    // Enviar resposta via WhatsApp
    if (user.whatsapp_token) {
      await sendWhatsAppMessage(clientPhone, aiResponse, user.whatsapp_token)
    }

    return NextResponse.json({ 
      success: true,
      response: aiResponse,
      intent: intent.intent,
      appointmentCreated,
    })
  } catch (error) {
    console.error('Erro ao processar automação:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
