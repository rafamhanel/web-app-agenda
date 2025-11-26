import OpenAI from 'openai'
import { supabase } from './supabase'
import { findAvailableSlots } from './google-calendar'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Gerar resposta personalizada usando IA
export async function generateAIResponse(
  userId: string,
  clientMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant', content: string }>
) {
  try {
    // Buscar configurações do usuário
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    // Buscar horários disponíveis
    const availableSlots = await findAvailableSlots(
      user.google_calendar_token,
      user.business_hours_start,
      user.business_hours_end,
      user.appointment_duration,
      7 // próximos 7 dias
    )

    // Formatar horários disponíveis
    const formattedSlots = availableSlots.slice(0, 5).map(slot => {
      const date = slot.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        day: '2-digit', 
        month: 'long' 
      })
      const time = slot.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      return `${date} às ${time}`
    }).join('\n')

    // Criar prompt personalizado
    const systemPrompt = `Você é um assistente virtual que responde mensagens de WhatsApp para ${user.name}.

INFORMAÇÕES IMPORTANTES:
- Nome do profissional: ${user.name}
- Tom de voz: ${user.tone_of_voice}
- Horário de funcionamento: ${user.business_hours_start} às ${user.business_hours_end}
- Duração dos atendimentos: ${user.appointment_duration} minutos

HORÁRIOS DISPONÍVEIS NOS PRÓXIMOS DIAS:
${formattedSlots}

INSTRUÇÕES:
1. Responda de forma natural, usando o tom de voz especificado
2. Use emojis quando apropriado (mas sem exagero)
3. Seja educado, prestativo e profissional
4. Se o cliente perguntar sobre horários, ofereça as opções disponíveis
5. Se o cliente quiser agendar, confirme o horário escolhido
6. Se o cliente quiser cancelar ou reagendar, seja compreensivo
7. Mantenha as respostas curtas e diretas
8. Use linguagem brasileira natural

IMPORTANTE: Você está respondendo pelo WhatsApp, então seja conciso e objetivo.`

    // Criar mensagens para a API
    const messages: Array<{ role: 'system' | 'user' | 'assistant', content: string }> = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: clientMessage },
    ]

    // Gerar resposta
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 300,
    })

    return completion.choices[0].message.content || 'Desculpe, não consegui processar sua mensagem.'
  } catch (error) {
    console.error('Erro ao gerar resposta IA:', error)
    return 'Desculpe, estou com dificuldades técnicas no momento. Por favor, tente novamente em alguns instantes.'
  }
}

// Analisar intenção da mensagem
export async function analyzeMessageIntent(message: string): Promise<{
  intent: 'agendar' | 'cancelar' | 'reagendar' | 'informacao' | 'outro'
  confidence: number
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Analise a mensagem do cliente e identifique a intenção principal.
          
Retorne APENAS um JSON no formato:
{
  "intent": "agendar" | "cancelar" | "reagendar" | "informacao" | "outro",
  "confidence": 0.0 a 1.0
}

Intenções:
- agendar: cliente quer marcar um horário
- cancelar: cliente quer cancelar um agendamento
- reagendar: cliente quer mudar um horário já marcado
- informacao: cliente quer informações (preço, localização, etc)
- outro: outras mensagens (saudações, agradecimentos, etc)`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return result
  } catch (error) {
    console.error('Erro ao analisar intenção:', error)
    return { intent: 'outro', confidence: 0 }
  }
}

// Extrair informações de agendamento da mensagem
export async function extractAppointmentInfo(message: string): Promise<{
  date?: string
  time?: string
  clientName?: string
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Extraia informações de agendamento da mensagem do cliente.
          
Retorne APENAS um JSON no formato:
{
  "date": "YYYY-MM-DD" ou null,
  "time": "HH:MM" ou null,
  "clientName": "nome" ou null
}

Exemplos:
- "Quero agendar para amanhã às 14h" -> {"date": "2024-01-15", "time": "14:00", "clientName": null}
- "Meu nome é João, pode ser sexta?" -> {"date": null, "time": null, "clientName": "João"}`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return result
  } catch (error) {
    console.error('Erro ao extrair informações:', error)
    return {}
  }
}

// Treinar IA com exemplos de conversas do usuário
export async function trainAIWithExamples(
  userId: string,
  examples: Array<{ message: string, response: string }>
) {
  // Salvar exemplos no banco para usar no contexto
  try {
    const { error } = await supabase
      .from('ai_training_examples')
      .insert(
        examples.map(example => ({
          user_id: userId,
          example_message: example.message,
          example_response: example.response,
        }))
      )

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erro ao salvar exemplos de treinamento:', error)
    throw error
  }
}
