import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Listar projetos do usuário
export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: decoded.userId
      },
      include: {
        todos: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Erro ao buscar projetos:', error)
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo projeto
export async function POST(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const { title, description, status, priority, deadline } = await request.json()

    // Validações
    if (!title) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        title,
        description: description || '',
        status: status || 'IN_PROGRESS',
        priority: priority || 'MEDIUM',
        deadline: deadline ? new Date(deadline) : null,
        userId: decoded.userId
      },
      include: {
        todos: true
      }
    })

    return NextResponse.json({ 
      message: 'Projeto criado com sucesso',
      project 
    })
  } catch (error) {
    console.error('Erro ao criar projeto:', error)
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 