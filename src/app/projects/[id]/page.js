"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthGuard } from "@/components/AuthGuard"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { TodoForm } from "@/components/TodoForm"
import { ProjectForm } from "@/components/ProjectForm"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Calendar,
  Flag,
  Plus
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const STATUS_CONFIG = {
  IN_PROGRESS: {
    label: "Em Andamento",
    icon: Clock,
    color: "bg-yellow-500",
    textColor: "text-yellow-700 dark:text-yellow-300",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30"
  },
  PAUSED: {
    label: "Pausado",
    icon: AlertTriangle,
    color: "bg-orange-500",
    textColor: "text-orange-700 dark:text-orange-300",
    bgColor: "bg-orange-100 dark:bg-orange-900/30"
  },
  COMPLETED: {
    label: "Concluído",
    icon: CheckCircle,
    color: "bg-green-500",
    textColor: "text-green-700 dark:text-green-300",
    bgColor: "bg-green-100 dark:bg-green-900/30"
  },
  CANCELLED: {
    label: "Cancelado",
    icon: XCircle,
    color: "bg-red-500",
    textColor: "text-red-700 dark:text-red-300",
    bgColor: "bg-red-100 dark:bg-red-900/30"
  }
}

const PRIORITY_CONFIG = {
  LOW: {
    label: "Baixa",
    color: "bg-green-500",
    textColor: "text-green-700 dark:text-green-300"
  },
  MEDIUM: {
    label: "Média",
    color: "bg-yellow-500",
    textColor: "text-yellow-700 dark:text-yellow-300"
  },
  HIGH: {
    label: "Alta",
    color: "bg-red-500",
    textColor: "text-red-700 dark:text-red-300"
  }
}

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id

  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showEditForm, setShowEditForm] = useState(false)
  const [showTodoForm, setShowTodoForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Carregar projeto
  const loadProject = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/projects/${projectId}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 404) {
          router.push('/')
          return
        }
        throw new Error('Erro ao carregar projeto')
      }

      const data = await response.json()
      setProject(data.project)
    } catch (error) {
      console.error('Erro ao carregar projeto:', error)
      setError('Erro ao carregar projeto')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      loadProject()
    }
  }, [projectId])

  const handleToggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  const handleUpdateProject = async (data) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar projeto')
      }

      const updatedProject = await response.json()
      setProject(updatedProject.project)
      setShowEditForm(false)
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error)
      setError(error.message)
    }
  }

  const handleDeleteProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao deletar projeto')
      }

      router.push('/')
    } catch (error) {
      console.error('Erro ao deletar projeto:', error)
      setError(error.message)
    }
  }

  const handleAddTodo = async (text) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao adicionar tarefa')
      }

      const data = await response.json()
      setProject(prev => ({
        ...prev,
        todos: [...prev.todos, data.todo]
      }))
      setShowTodoForm(false)
    } catch (error) {
      console.error('Erro ao adicionar todo:', error)
      setError(error.message)
    }
  }

  const handleUpdateTodo = async (todoId, updates) => {
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar tarefa')
      }

      const data = await response.json()
      setProject(prev => ({
        ...prev,
        todos: prev.todos.map(t => t.id === todoId ? data.todo : t)
      }))
    } catch (error) {
      console.error('Erro ao atualizar todo:', error)
      setError(error.message)
    }
  }

  const handleDeleteTodo = async (todoId) => {
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao deletar tarefa')
      }

      setProject(prev => ({
        ...prev,
        todos: prev.todos.filter(t => t.id !== todoId)
      }))
    } catch (error) {
      console.error('Erro ao deletar todo:', error)
      setError(error.message)
    }
  }

  const handleTodoToggle = async (todoId, completed) => {
    await handleUpdateTodo(todoId, { completed })
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (error || !project) {
    return (
      <AuthGuard>
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Projeto não encontrado'}</p>
              <Button onClick={() => router.push('/')}>
                Voltar ao Dashboard
              </Button>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.IN_PROGRESS
  const priorityConfig = PRIORITY_CONFIG[project.priority] || PRIORITY_CONFIG.MEDIUM
  const StatusIcon = statusConfig.icon

  const completedTodos = project.todos.filter(todo => todo.completed).length
  const totalTodos = project.todos.length
  const progress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <DashboardSidebar 
          selectedView="projects"
          onViewChange={() => {}}
          isExpanded={sidebarExpanded}
          onNewProject={() => {}}
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader 
            onToggleSidebar={handleToggleSidebar}
            sidebarExpanded={sidebarExpanded}
          />
          
          <main className="flex-1 overflow-auto p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="h-10 w-10 p-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {project.title}
                </h1>
                {project.description && (
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {project.description}
                  </p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowEditForm(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Projeto
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir Projeto
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Project Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-lg">Informações do Projeto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} border-0 font-medium`}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {statusConfig.label}
                    </Badge>
                    
                    <Badge className={`${priorityConfig.color} text-white border-0 font-medium`}>
                      <Flag className="mr-1 h-3 w-3" />
                      {priorityConfig.label}
                    </Badge>

                    {project.deadline && (
                      <Badge variant="outline" className="font-medium">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(project.deadline)}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Progresso</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {completedTodos}/{totalTodos} tarefas
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-2">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Tarefas</CardTitle>
                      <Button 
                        size="sm"
                        onClick={() => setShowTodoForm(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Tarefa
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {project.todos.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                          Nenhuma tarefa adicionada
                        </p>
                        <Button 
                          onClick={() => setShowTodoForm(true)}
                          variant="outline"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Criar Primeira Tarefa
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {project.todos.map((todo) => (
                          <div key={todo.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                            <Checkbox
                              checked={todo.completed}
                              onCheckedChange={(checked) => handleTodoToggle(todo.id, checked)}
                              className="flex-shrink-0"
                            />
                            <span className={`flex-1 ${todo.completed ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                              {todo.text}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              onClick={() => handleDeleteTodo(todo.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Todo Form */}
            {showTodoForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
                  <h3 className="text-lg font-semibold mb-4">Adicionar Tarefa</h3>
                  <TodoForm
                    onSubmit={handleAddTodo}
                    onCancel={() => setShowTodoForm(false)}
                  />
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Edit Project Modal */}
        <ProjectForm
          project={project}
          isEditing={true}
          onSubmit={handleUpdateProject}
          onCancel={() => setShowEditForm(false)}
          open={showEditForm}
          onOpenChange={setShowEditForm}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Excluir Projeto"
          description={`Tem certeza que deseja excluir o projeto "${project.title}"? Esta ação não pode ser desfeita e todas as tarefas associadas serão removidas.`}
          confirmText="Excluir Projeto"
          cancelText="Cancelar"
          onConfirm={handleDeleteProject}
          variant="danger"
        />
      </div>
    </AuthGuard>
  )
} 