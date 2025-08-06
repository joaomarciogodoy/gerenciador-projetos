import { NextResponse } from 'next/server'
import { authenticateUser, generateToken } from '@/lib/auth'
import { getCookieExpiryConfig } from '@/lib/cookies'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validações básicas
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Autenticar usuário
    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    // Gerar token JWT
    const token = generateToken(user.id)

    // Criar resposta com cookie
    const response = NextResponse.json({
      message: 'Login realizado com sucesso',
      user,
    })

    // Configurar cookie seguro
    response.cookies.set('auth-token', token, getCookieExpiryConfig())

    return response
  } catch (error) {
    console.error('Erro no login:', error)
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 