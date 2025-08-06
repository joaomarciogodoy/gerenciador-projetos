import { NextResponse } from 'next/server'
import { getCookieClearConfig } from '@/lib/cookies'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Rotas que não precisam de autenticação
  const publicRoutes = ['/login', '/register', '/api/auth/login', '/api/auth/register']
  
  // Verificar se é uma rota pública
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Verificar se é uma rota da API
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Verificar se existe o cookie de autenticação
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    // Redirecionar para login se não estiver autenticado
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se existe o token, permitir acesso
  // A verificação real será feita pelo AuthGuard no cliente
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 