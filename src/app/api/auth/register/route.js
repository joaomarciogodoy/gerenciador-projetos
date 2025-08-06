import { NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, name, password } = await request.json()

    // Validações básicas
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Criar usuário
    const user = await createUser(email, name, password)

    return NextResponse.json({
      message: 'Usuário criado com sucesso',
      user,
    })
  } catch (error) {
    console.error('Erro no registro:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Este email já está em uso' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 