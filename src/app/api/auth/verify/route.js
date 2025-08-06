import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token não encontrado' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { valid: false, error: 'Token inválido' },
        { status: 401 }
      )
    }

    return NextResponse.json({ 
      valid: true, 
      user: { userId: decoded.userId } 
    })
  } catch (error) {
    console.error('Erro ao verificar token:', error)
    
    return NextResponse.json(
      { valid: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 