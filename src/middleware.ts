import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rotas protegidas
  const protectedRoutes = ["/dashboard", "/automation"]
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )

  // Redirecionar para login se não estiver autenticado
  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/login"
    return NextResponse.redirect(redirectUrl)
  }

  // Redirecionar para dashboard se já estiver autenticado e tentar acessar login/signup
  if (
    session &&
    (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup")
  ) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/dashboard"
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/automation/:path*", "/login", "/signup"],
}
