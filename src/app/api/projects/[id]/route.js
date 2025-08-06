import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

// GET - Buscar projeto específico
export async function GET(request, { params }) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const projectId = params.id

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: decoded.userId
      },
      include: {
        todos: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Erro ao buscar projeto:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// PUT - Atualizar projeto
export async function PUT(request, { params }) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const projectId = params.id
    const body = await request.json()

    // Verificar se o projeto existe e pertence ao usuário
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: decoded.userId
      }
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 })
    }

    // Atualizar projeto
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
        deadline: body.deadline
      },
      include: {
        todos: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    return NextResponse.json({ project: updatedProject })
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// DELETE - Deletar projeto
export async function DELETE(request, { params }) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const projectId = params.id

    // Verificar se o projeto existe e pertence ao usuário
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: decoded.userId
      }
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 })
    }

    // Deletar projeto (todos serão deletados automaticamente devido à relação)
    await prisma.project.delete({
      where: {
        id: projectId
      }
    })

    return NextResponse.json({ message: 'Projeto deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar projeto:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 