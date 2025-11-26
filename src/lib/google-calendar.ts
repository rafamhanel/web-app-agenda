import { google } from 'googleapis'

// Configuração do cliente OAuth2 do Google
export function getGoogleAuthClient(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  oauth2Client.setCredentials({
    access_token: accessToken,
  })

  return oauth2Client
}

// Listar eventos da agenda
export async function listCalendarEvents(accessToken: string, timeMin?: Date, timeMax?: Date) {
  const auth = getGoogleAuthClient(accessToken)
  const calendar = google.calendar({ version: 'v3', auth })

  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin?.toISOString() || new Date().toISOString(),
      timeMax: timeMax?.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    return response.data.items || []
  } catch (error) {
    console.error('Erro ao listar eventos:', error)
    throw error
  }
}

// Criar evento na agenda
export async function createCalendarEvent(
  accessToken: string,
  event: {
    summary: string
    description?: string
    start: Date
    end: Date
    attendees?: string[]
  }
) {
  const auth = getGoogleAuthClient(accessToken)
  const calendar = google.calendar({ version: 'v3', auth })

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: event.summary,
        description: event.description,
        start: {
          dateTime: event.start.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: event.end.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        attendees: event.attendees?.map(email => ({ email })),
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      },
    })

    return response.data
  } catch (error) {
    console.error('Erro ao criar evento:', error)
    throw error
  }
}

// Atualizar evento
export async function updateCalendarEvent(
  accessToken: string,
  eventId: string,
  updates: {
    summary?: string
    description?: string
    start?: Date
    end?: Date
  }
) {
  const auth = getGoogleAuthClient(accessToken)
  const calendar = google.calendar({ version: 'v3', auth })

  try {
    const response = await calendar.events.patch({
      calendarId: 'primary',
      eventId,
      requestBody: {
        summary: updates.summary,
        description: updates.description,
        start: updates.start ? {
          dateTime: updates.start.toISOString(),
          timeZone: 'America/Sao_Paulo',
        } : undefined,
        end: updates.end ? {
          dateTime: updates.end.toISOString(),
          timeZone: 'America/Sao_Paulo',
        } : undefined,
      },
    })

    return response.data
  } catch (error) {
    console.error('Erro ao atualizar evento:', error)
    throw error
  }
}

// Deletar evento
export async function deleteCalendarEvent(accessToken: string, eventId: string) {
  const auth = getGoogleAuthClient(accessToken)
  const calendar = google.calendar({ version: 'v3', auth })

  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
    })

    return true
  } catch (error) {
    console.error('Erro ao deletar evento:', error)
    throw error
  }
}

// Verificar disponibilidade
export async function checkAvailability(
  accessToken: string,
  startTime: Date,
  endTime: Date
) {
  const events = await listCalendarEvents(accessToken, startTime, endTime)
  
  // Se não há eventos no período, está disponível
  return events.length === 0
}

// Buscar próximos horários disponíveis
export async function findAvailableSlots(
  accessToken: string,
  businessHoursStart: string, // "09:00"
  businessHoursEnd: string, // "18:00"
  appointmentDuration: number, // em minutos
  daysAhead: number = 7
) {
  const availableSlots: Date[] = []
  const now = new Date()

  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() + i)
    
    // Pular finais de semana
    if (date.getDay() === 0 || date.getDay() === 6) continue

    const [startHour, startMinute] = businessHoursStart.split(':').map(Number)
    const [endHour, endMinute] = businessHoursEnd.split(':').map(Number)

    const dayStart = new Date(date)
    dayStart.setHours(startHour, startMinute, 0, 0)

    const dayEnd = new Date(date)
    dayEnd.setHours(endHour, endMinute, 0, 0)

    // Verificar cada slot de tempo
    let currentSlot = new Date(dayStart)
    while (currentSlot < dayEnd) {
      const slotEnd = new Date(currentSlot)
      slotEnd.setMinutes(slotEnd.getMinutes() + appointmentDuration)

      if (slotEnd <= dayEnd) {
        const isAvailable = await checkAvailability(accessToken, currentSlot, slotEnd)
        if (isAvailable) {
          availableSlots.push(new Date(currentSlot))
        }
      }

      currentSlot.setMinutes(currentSlot.getMinutes() + appointmentDuration)
    }
  }

  return availableSlots
}
