import { NextResponse } from 'next/server'
import { getCookieClearConfig } from '@/lib/cookies'

export async function POST() {
  try {
    const response = NextResponse.json({
      message: 'Logout realizado com sucesso',
    })

    // Remover cookie de autenticação
    response.cookies.set('auth-token', '', getCookieClearConfig())

    return response
  } catch (error) {
    console.error('Erro no logout:', error)
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 