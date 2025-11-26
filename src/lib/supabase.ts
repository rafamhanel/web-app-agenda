import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Variáveis de ambiente do Supabase não configuradas")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos do banco de dados
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  subscription_status: "free" | "active" | "canceled" | "past_due"
  subscription_id: string | null
  subscription_end_date: string | null
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  user_id: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  service_type: string
  appointment_date: string
  duration_minutes: number
  status: "scheduled" | "confirmed" | "canceled" | "completed"
  notes: string | null
  google_event_id: string | null
  created_at: string
  updated_at: string
}

export interface WhatsAppConversation {
  id: string
  user_id: string
  customer_phone: string
  customer_name: string | null
  last_message: string | null
  last_message_at: string
  status: "active" | "archived"
  created_at: string
}

export interface WhatsAppMessage {
  id: string
  conversation_id: string
  sender_type: "customer" | "bot" | "user"
  message_text: string
  message_type: "text" | "image" | "audio" | "video" | "document"
  metadata: any
  created_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  business_name: string | null
  business_hours: any
  whatsapp_number: string | null
  google_calendar_id: string | null
  ai_personality: string
  auto_reply_enabled: boolean
  created_at: string
  updated_at: string
}
