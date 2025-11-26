"use client"

import { Calendar, MessageSquare, Clock, Star, CheckCircle2, Zap, Users, Settings, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: ""
  })
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    // Aqui você integraria com seu backend/banco de dados
    console.log("Lead capturado:", formData)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-black text-white rounded-full text-sm font-medium">
            <Star className="w-4 h-4" />
            <span>Automatize seu atendimento</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Sua agenda e WhatsApp<br />trabalhando no automático
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Integração inteligente entre Google Agenda e WhatsApp Business.<br />
            Respostas automáticas que parecem humanas.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-full"
              onClick={() => router.push("/signup")}
            >
              Começar grátis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-6 text-lg rounded-full"
              onClick={() => router.push("/login")}
            >
              Fazer login
            </Button>
          </div>
        </div>
      </section>

      {/* Sobre o Produto */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                O problema que você enfrenta todo dia
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  Você trabalha sozinho. Atende clientes, faz o serviço, cuida da agenda e ainda precisa responder mensagens o dia inteiro.
                </p>
                <p>
                  Enquanto isso, perde tempo confirmando horários, reagendando compromissos e respondendo as mesmas perguntas repetidamente.
                </p>
                <p className="font-semibold text-gray-900">
                  Seu tempo vale mais do que isso.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">A solução</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Um assistente virtual que conecta sua agenda do Google com seu WhatsApp Business.
                </p>
                <p>
                  Ele responde seus clientes automaticamente, com o seu jeito de falar. Confirma horários, reagenda compromissos e mantém tudo organizado.
                </p>
                <p className="font-semibold text-gray-900">
                  Você ganha horas por dia. Seus clientes recebem respostas instantâneas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O que o MVP faz */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que o sistema faz por você
            </h2>
            <p className="text-xl text-gray-600">
              Funcionalidades essenciais para automatizar seu dia a dia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-gray-200 hover:border-black transition-colors">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Integração com Google Agenda
                </h3>
                <p className="text-gray-600">
                  Sincroniza automaticamente todos os seus compromissos e horários disponíveis em tempo real.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-black transition-colors">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Respostas automáticas no WhatsApp
                </h3>
                <p className="text-gray-600">
                  Responde mensagens instantaneamente usando inteligência artificial treinada no seu estilo.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-black transition-colors">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Gestão completa de horários
                </h3>
                <p className="text-gray-600">
                  Confirma, reagenda e cancela compromissos automaticamente com base na sua disponibilidade.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-black transition-colors">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  IA com seu tom de voz
                </h3>
                <p className="text-gray-600">
                  Aprende seu jeito de falar, suas gírias, emojis e nível de formalidade para soar natural.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-black transition-colors">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Configuração personalizada
                </h3>
                <p className="text-gray-600">
                  Define seus horários de trabalho, regras de agendamento e preferências de atendimento.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-black transition-colors">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Zero erros de agendamento
                </h3>
                <p className="text-gray-600">
                  Evita conflitos de horário e garante que você nunca marque dois clientes no mesmo momento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demonstração Visual */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como funciona na prática
            </h2>
            <p className="text-xl text-gray-600">
              Interface simples e intuitiva
            </p>
          </div>

          <div className="space-y-12">
            {/* Mockup 1 - Agenda */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-4">
                  Tela 1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Sua agenda sincronizada
                </h3>
                <p className="text-gray-600 text-lg mb-4">
                  Visualize todos os seus compromissos em um só lugar. O sistema sincroniza automaticamente com o Google Calendar.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                    <span>Visualização diária, semanal e mensal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                    <span>Horários disponíveis destacados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                    <span>Atualização em tempo real</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold text-gray-900">Agenda</h4>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-black text-white rounded-lg">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">09:00 - Cliente A</div>
                        <div className="text-xs opacity-80">Confirmado</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">11:00 - Disponível</div>
                        <div className="text-xs text-gray-500">Horário livre</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-black text-white rounded-lg">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">14:00 - Cliente B</div>
                        <div className="text-xs opacity-80">Aguardando confirmação</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup 2 - Respostas */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-bold text-gray-900">WhatsApp</h4>
                      <MessageSquare className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                        <p className="text-sm text-gray-900">Oi! Tem horário amanhã de manhã?</p>
                        <span className="text-xs text-gray-500">Cliente - 10:23</span>
                      </div>
                      <div className="bg-black text-white p-3 rounded-lg rounded-tr-none max-w-[80%] ml-auto">
                        <p className="text-sm">Oi! Tenho sim 😊 Posso te encaixar às 09h ou 11h. Qual prefere?</p>
                        <span className="text-xs opacity-70">Você (IA) - 10:23</span>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                        <p className="text-sm text-gray-900">09h tá perfeito!</p>
                        <span className="text-xs text-gray-500">Cliente - 10:24</span>
                      </div>
                      <div className="bg-black text-white p-3 rounded-lg rounded-tr-none max-w-[80%] ml-auto">
                        <p className="text-sm">Fechado! Agendei você pra amanhã às 09h. Te mando um lembrete antes 👍</p>
                        <span className="text-xs opacity-70">Você (IA) - 10:24</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-4">
                  Tela 2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Respostas automáticas naturais
                </h3>
                <p className="text-gray-600 text-lg mb-4">
                  A IA responde seus clientes com seu tom de voz, usando suas expressões e emojis habituais.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                    <span>Respostas instantâneas 24/7</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                    <span>Tom personalizado e natural</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                    <span>Confirmação automática de horários</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Mockup 3 - Configurações */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-4">
                  Tela 3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Configuração simples
                </h3>
                <p className="text-gray-600 text-lg mb-4">
                  Defina suas regras de atendimento, horários de trabalho e preferências em poucos cliques.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                    <span>Horários de funcionamento personalizados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                    <span>Duração padrão dos atendimentos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                    <span>Mensagens automáticas customizáveis</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold text-gray-900">Configurações</h4>
                    <Settings className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Horário de trabalho</label>
                      <div className="flex gap-2">
                        <div className="flex-1 p-2 bg-gray-50 rounded border border-gray-200 text-sm text-gray-900">09:00</div>
                        <div className="flex-1 p-2 bg-gray-50 rounded border border-gray-200 text-sm text-gray-900">18:00</div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Duração do atendimento</label>
                      <div className="p-2 bg-gray-50 rounded border border-gray-200 text-sm text-gray-900">60 minutos</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Tom de voz</label>
                      <div className="p-2 bg-gray-50 rounded border border-gray-200 text-sm text-gray-900">Amigável e informal</div>
                    </div>
                    <button className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                      Salvar configurações
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que você ganha com isso
            </h2>
            <p className="text-xl text-gray-600">
              Benefícios reais para o seu dia a dia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Economize horas por dia
              </h3>
              <p className="text-gray-600">
                Pare de perder tempo respondendo as mesmas perguntas. Foque no que realmente importa: seu trabalho.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Zero erros de agendamento
              </h3>
              <p className="text-gray-600">
                Nunca mais marque dois clientes no mesmo horário ou esqueça de confirmar um compromisso.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Atendimento humanizado
              </h3>
              <p className="text-gray-600">
                Seus clientes recebem respostas que parecem vir de você, mantendo o toque pessoal do seu atendimento.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Mais profissionalismo
              </h3>
              <p className="text-gray-600">
                Respostas instantâneas e organização impecável transmitem seriedade e confiança aos seus clientes.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Organização total
              </h3>
              <p className="text-gray-600">
                Tenha controle completo da sua agenda sem esforço. Tudo sincronizado e atualizado automaticamente.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Disponível 24/7
              </h3>
              <p className="text-gray-600">
                Seus clientes podem agendar e receber informações a qualquer hora, mesmo quando você está ocupado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="waitlist" className="px-4 py-20 bg-black text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comece a automatizar hoje
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Cadastre-se grátis e teste todas as funcionalidades por 7 dias
          </p>

          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white hover:bg-gray-100 text-black px-8 py-6 text-lg rounded-full"
              onClick={() => router.push("/signup")}
            >
              Criar conta grátis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <p className="text-sm text-gray-400 mt-6">
            Sem cartão de crédito. Cancele quando quiser.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
          <p>© 2024 - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  )
}
