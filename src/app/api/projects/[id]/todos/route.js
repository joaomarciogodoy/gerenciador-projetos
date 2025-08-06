import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Adicionar todo ao projeto
export async function POST(request, { params }) {
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

    const { id: projectId } = params
    const { text } = await request.json()

    // Verificar se o projeto pertence ao usuário
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: decoded.userId
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 }
      )
    }

    // Validações
    if (!text || text.trim() === '') {
      return NextResponse.json(
        { error: 'Texto da tarefa é obrigatório' },
        { status: 400 }
      )
    }

    const todo = await prisma.todo.create({
      data: {
        text: text.trim(),
        projectId,
        userId: decoded.userId
      }
    })

    return NextResponse.json({ 
      message: 'Tarefa adicionada com sucesso',
      todo 
    })
  } catch (error) {
    console.error('Erro ao adicionar todo:', error)
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 