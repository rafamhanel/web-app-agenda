"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Calendar, MessageSquare, Check } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Erro ao criar conta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="w-8 h-8" />
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Comece grátis</h1>
          <p className="text-gray-600 mt-2">Crie sua conta em segundos</p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Cadastro</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="João Silva"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
                <p className="text-xs text-gray-500">Mínimo de 6 caracteres</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium text-gray-900">Plano Gratuito inclui:</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" />
                    <span>Acesso básico ao dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" />
                    <span>Visualização da agenda</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" />
                    <span>Teste por 7 dias</span>
                  </li>
                </ul>
                <p className="text-xs text-gray-500 pt-2">
                  Faça upgrade para desbloquear automação completa
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Criar conta grátis"
                )}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-black font-medium hover:underline">
                  Faça login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  )
}
