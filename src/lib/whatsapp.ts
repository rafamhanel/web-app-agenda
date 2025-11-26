// WhatsApp Business API Integration
// Usando a API oficial do WhatsApp Business

interface WhatsAppMessage {
  to: string // número do destinatário
  type: 'text' | 'template'
  text?: {
    body: string
  }
  template?: {
    name: string
    language: {
      code: string
    }
    components?: any[]
  }
}

// Enviar mensagem de texto
export async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string,
  accessToken: string
) {
  const whatsappApiUrl = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`

  const payload: WhatsAppMessage = {
    to: phoneNumber,
    type: 'text',
    text: {
      body: message,
    },
  }

  try {
    const response = await fetch(whatsappApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao enviar mensagem WhatsApp:', error)
    throw error
  }
}

// Enviar template de confirmação
export async function sendConfirmationTemplate(
  phoneNumber: string,
  clientName: string,
  appointmentDate: string,
  appointmentTime: string,
  accessToken: string
) {
  const whatsappApiUrl = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`

  const payload: WhatsAppMessage = {
    to: phoneNumber,
    type: 'template',
    template: {
      name: 'appointment_confirmation',
      language: {
        code: 'pt_BR',
      },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: clientName },
            { type: 'text', text: appointmentDate },
            { type: 'text', text: appointmentTime },
          ],
        },
      ],
    },
  }

  try {
    const response = await fetch(whatsappApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao enviar template de confirmação:', error)
    throw error
  }
}

// Enviar lembrete de agendamento
export async function sendAppointmentReminder(
  phoneNumber: string,
  clientName: string,
  appointmentTime: string,
  accessToken: string
) {
  const message = `Oi ${clientName}! Lembrete: você tem um horário marcado hoje às ${appointmentTime}. Te espero! 😊`
  
  return sendWhatsAppMessage(phoneNumber, message, accessToken)
}

// Processar webhook do WhatsApp (mensagens recebidas)
export function processWhatsAppWebhook(webhookData: any) {
  try {
    const entry = webhookData.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value

    if (!value?.messages) {
      return null
    }

    const message = value.messages[0]
    const from = message.from // número do remetente
    const messageText = message.text?.body || ''
    const messageId = message.id
    const timestamp = message.timestamp

    return {
      from,
      messageText,
      messageId,
      timestamp,
      type: message.type,
    }
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return null
  }
}

// Marcar mensagem como lida
export async function markMessageAsRead(
  messageId: string,
  accessToken: string
) {
  const whatsappApiUrl = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`

  try {
    const response = await fetch(whatsappApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      }),
    })

    return await response.json()
  } catch (error) {
    console.error('Erro ao marcar mensagem como lida:', error)
    throw error
  }
}

// Validar webhook do WhatsApp (verificação inicial)
export function validateWhatsAppWebhook(
  mode: string,
  token: string,
  challenge: string
): string | null {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN

  if (mode === 'subscribe' && token === verifyToken) {
    return challenge
  }

  return null
}
