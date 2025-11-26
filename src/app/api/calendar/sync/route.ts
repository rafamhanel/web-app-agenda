import { NextRequest, NextResponse } from 'next/server'
import { listCalendarEvents } from '@/lib/google-calendar'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Buscar usuário
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (!user || !user.google_calendar_token) {
      return NextResponse.json({ error: 'User not found or not connected' }, { status: 404 })
    }

    // Buscar eventos dos próximos 30 dias
    const now = new Date()
    const thirtyDaysLater = new Date()
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30)

    const events = await listCalendarEvents(
      user.google_calendar_token,
      now,
      thirtyDaysLater
    )

    // Sincronizar eventos com o banco de dados
    for (const event of events) {
      if (!event.start?.dateTime || !event.end?.dateTime) continue

      // Verificar se já existe
      const { data: existing } = await supabase
        .from('appointments')
        .select('id')
        .eq('google_event_id', event.id)
        .single()

      if (!existing) {
        // Criar novo agendamento
        await supabase.from('appointments').insert({
          user_id: userId,
          client_name: event.summary || 'Sem título',
          client_phone: '', // Extrair do evento se disponível
          start_time: event.start.dateTime,
          end_time: event.end.dateTime,
          status: 'confirmed',
          google_event_id: event.id,
        })
      }
    }

    return NextResponse.json({ 
      success: true, 
      syncedEvents: events.length 
    })
  } catch (error) {
    console.error('Erro ao sincronizar agenda:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
