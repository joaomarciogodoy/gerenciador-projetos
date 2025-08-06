import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT - Atualizar todo
export async function PUT(request, { params }) {
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

    const { id } = params
    const { text, completed } = await request.json()

    // Verificar se o todo pertence ao usuário
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id,
        userId: decoded.userId
      },
      include: {
        project: true
      }
    })

    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada' },
        { status: 404 }
      )
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        text: text !== undefined ? text : existingTodo.text,
        completed: completed !== undefined ? completed : existingTodo.completed,
      }
    })

    return NextResponse.json({ 
      message: 'Tarefa atualizada com sucesso',
      todo 
    })
  } catch (error) {
    console.error('Erro ao atualizar todo:', error)
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar todo
export async function DELETE(request, { params }) {
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

    const { id } = params

    // Verificar se o todo pertence ao usuário
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id,
        userId: decoded.userId
      }
    })

    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada' },
        { status: 404 }
      )
    }

    await prisma.todo.delete({
      where: { id }
    })

    return NextResponse.json({ 
      message: 'Tarefa deletada com sucesso'
    })
  } catch (error) {
    console.error('Erro ao deletar todo:', error)
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 