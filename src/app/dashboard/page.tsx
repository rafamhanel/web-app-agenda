"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Calendar, MessageSquare, Clock, Settings, LogOut, CreditCard, Check, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Profile {
  id: string
  email: string
  full_name: string | null
  subscription_status: string
  subscription_end_date: string | null
}

interface Appointment {
  id: string
  customer_name: string
  customer_phone: string
  appointment_date: string
  status: string
  service_type: string
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/login")
        return
      }

      // Buscar perfil do usuário
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
      }

      // Buscar agendamentos
      const { data: appointmentsData } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user.id)
        .order("appointment_date", { ascending: true })
        .limit(5)

      if (appointmentsData) {
        setAppointments(appointmentsData)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const isPremium = profile?.subscription_status === "active"

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            <MessageSquare className="w-6 h-6" />
            <span className="font-bold text-lg">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {profile?.full_name || profile?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Alerta de plano gratuito */}
        {!isPremium && (
          <Alert className="mb-6 border-2 border-black bg-gradient-to-r from-gray-50 to-white">
            <Zap className="h-5 w-5" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Você está no plano gratuito</p>
                <p className="text-sm text-gray-600">
                  Faça upgrade para desbloquear automação completa com IA, integração com WhatsApp e muito mais
                </p>
              </div>
              <Button className="bg-black hover:bg-gray-800 ml-4">
                <CreditCard className="w-4 h-4 mr-2" />
                Fazer Upgrade
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Cards de estatísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Agendamentos Hoje
              </CardTitle>
              <Calendar className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {appointments.filter(a => {
                  const today = new Date().toDateString()
                  const appointmentDate = new Date(a.appointment_date).toDateString()
                  return today === appointmentDate
                }).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Mensagens Automáticas
              </CardTitle>
              <MessageSquare className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isPremium ? "24" : "0"}
              </div>
              {!isPremium && (
                <p className="text-xs text-gray-500 mt-1">Disponível no plano premium</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Status da Conta
              </CardTitle>
              <Settings className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {isPremium ? (
                  <span className="text-green-600">Premium Ativo</span>
                ) : (
                  <span className="text-gray-600">Gratuito</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Próximos agendamentos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
            <CardDescription>
              Seus compromissos mais recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {appointment.customer_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.service_type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(appointment.appointment_date).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.appointment_date).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum agendamento encontrado</p>
                <p className="text-sm text-gray-500 mt-2">
                  Seus próximos compromissos aparecerão aqui
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recursos Premium */}
        {!isPremium && (
          <Card className="border-2 border-black">
            <CardHeader>
              <CardTitle>Desbloqueie o Poder da Automação</CardTitle>
              <CardDescription>
                Veja tudo que você ganha com o plano premium
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Respostas automáticas com IA</p>
                    <p className="text-sm text-gray-600">
                      Atenda seus clientes 24/7 com inteligência artificial
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Integração com WhatsApp</p>
                    <p className="text-sm text-gray-600">
                      Conecte seu WhatsApp Business automaticamente
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Sincronização com Google Agenda</p>
                    <p className="text-sm text-gray-600">
                      Todos os agendamentos sincronizados em tempo real
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Agendamentos ilimitados</p>
                    <p className="text-sm text-gray-600">
                      Sem limite de compromissos ou mensagens
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Personalização da IA</p>
                    <p className="text-sm text-gray-600">
                      Configure o tom de voz e personalidade do assistente
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Suporte prioritário</p>
                    <p className="text-sm text-gray-600">
                      Atendimento rápido quando você precisar
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black text-white p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold">R$ 97/mês</p>
                    <p className="text-sm text-gray-300">Cancele quando quiser</p>
                  </div>
                  <Button className="bg-white text-black hover:bg-gray-100">
                    Assinar Agora
                  </Button>
                </div>
                <p className="text-sm text-gray-300">
                  🎁 Primeiro mês com 50% de desconto - apenas R$ 48,50
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
