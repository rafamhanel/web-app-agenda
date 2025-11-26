"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Bot, Clock, CheckCircle, XCircle, TrendingUp, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Message {
  id: string
  client_phone: string
  message: string
  is_from_client: boolean
  is_automated: boolean
  created_at: string
}

interface Conversation {
  client_phone: string
  last_message: string
  last_message_time: string
  message_count: number
  has_appointment: boolean
}

export default function AutomationPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [stats, setStats] = useState({
    totalConversations: 0,
    automatedResponses: 0,
    appointmentsCreated: 0,
    responseTime: "2s",
  })

  // Simular dados (substituir por chamadas reais ao Supabase)
  useEffect(() => {
    // Dados de exemplo
    setConversations([
      {
        client_phone: "+55 11 98765-4321",
        last_message: "Oi! Gostaria de agendar um horário",
        last_message_time: "2 min atrás",
        message_count: 3,
        has_appointment: false,
      },
      {
        client_phone: "+55 11 91234-5678",
        last_message: "Obrigado! Até amanhã 😊",
        last_message_time: "15 min atrás",
        message_count: 8,
        has_appointment: true,
      },
      {
        client_phone: "+55 11 99999-8888",
        last_message: "Qual o endereço?",
        last_message_time: "1 hora atrás",
        message_count: 2,
        has_appointment: false,
      },
    ])

    setStats({
      totalConversations: 24,
      automatedResponses: 156,
      appointmentsCreated: 18,
      responseTime: "2s",
    })
  }, [])

  const loadMessages = (phone: string) => {
    setSelectedConversation(phone)
    // Simular mensagens (substituir por chamada real)
    setMessages([
      {
        id: "1",
        client_phone: phone,
        message: "Oi! Gostaria de agendar um horário",
        is_from_client: true,
        is_automated: false,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        client_phone: phone,
        message: "Oi! Tudo bem? 😊 Tenho esses horários disponíveis:\n\n1. Segunda-feira, 15 de janeiro às 14:00\n2. Terça-feira, 16 de janeiro às 10:00\n3. Quarta-feira, 17 de janeiro às 16:00\n\nQual funciona melhor pra você?",
        is_from_client: false,
        is_automated: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "3",
        client_phone: phone,
        message: "A segunda às 14h tá perfeito!",
        is_from_client: true,
        is_automated: false,
        created_at: new Date().toISOString(),
      },
    ])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Automação com IA</h1>
              <p className="text-sm text-gray-600 mt-1">Monitore conversas e agendamentos automáticos</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Conversas Ativas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{stats.totalConversations}</div>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Respostas Automáticas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{stats.automatedResponses}</div>
                <Bot className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Agendamentos Criados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{stats.appointmentsCreated}</div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Tempo de Resposta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{stats.responseTime}</div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lista de Conversas */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversas Recentes</CardTitle>
              <CardDescription>Clique para ver detalhes</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {conversations.map((conv) => (
                  <button
                    key={conv.client_phone}
                    onClick={() => loadMessages(conv.client_phone)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedConversation === conv.client_phone ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-gray-900">{conv.client_phone}</div>
                      {conv.has_appointment && (
                        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                          Agendado
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{conv.last_message}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{conv.last_message_time}</span>
                      <span>{conv.message_count} mensagens</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Visualização de Mensagens */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedConversation ? `Conversa com ${selectedConversation}` : "Selecione uma conversa"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedConversation ? (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.is_from_client ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.is_from_client
                            ? "bg-gray-100 text-gray-900"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs ${msg.is_from_client ? "text-gray-500" : "text-blue-100"}`}>
                            {new Date(msg.created_at).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {!msg.is_from_client && msg.is_automated && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                              <Bot className="w-3 h-3 mr-1" />
                              IA
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500">Selecione uma conversa para visualizar as mensagens</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Como Funciona */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-600" />
              <div>
                <CardTitle>Como a Automação Funciona</CardTitle>
                <CardDescription>Entenda o fluxo inteligente de respostas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">1. Cliente Envia Mensagem</h4>
                <p className="text-sm text-gray-600">
                  O cliente envia uma mensagem pelo WhatsApp perguntando sobre horários ou serviços.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">2. IA Analisa e Responde</h4>
                <p className="text-sm text-gray-600">
                  A IA analisa a intenção, consulta sua agenda e responde automaticamente com horários disponíveis.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">3. Agendamento Automático</h4>
                <p className="text-sm text-gray-600">
                  Quando o cliente escolhe um horário, a IA cria automaticamente o evento na sua agenda.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
