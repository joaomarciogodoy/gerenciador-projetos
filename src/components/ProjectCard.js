"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { TodoForm } from "./TodoForm"
import { ProjectForm } from "./ProjectForm"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Calendar,
  Flag,
  ExternalLink
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

export function ProjectCard({ 
  project, 
  onUpdate, 
  onDelete, 
  onAddTodo, 
  onUpdateTodo, 
  onDeleteTodo 
}) {
  const router = useRouter()
  const [showEditForm, setShowEditForm] = useState(false)
  const [showTodoForm, setShowTodoForm] = useState(false)
  const [showDeleteProjectDialog, setShowDeleteProjectDialog] = useState(false)
  const [showDeleteTodoDialog, setShowDeleteTodoDialog] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState(null)

  const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.IN_PROGRESS
  const priorityConfig = PRIORITY_CONFIG[project.priority] || PRIORITY_CONFIG.MEDIUM
  const StatusIcon = statusConfig.icon

  const completedTodos = project.todos.filter(todo => todo.completed).length
  const totalTodos = project.todos.length
  const progress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0

  const handleTodoToggle = async (todoId, completed) => {
    await onUpdateTodo(todoId, { completed })
  }

  const handleTodoDelete = async (todoId) => {
    setTodoToDelete(todoId)
    setShowDeleteTodoDialog(true)
  }

  const confirmDeleteTodo = async () => {
    if (todoToDelete) {
      await onDeleteTodo(todoToDelete)
      setTodoToDelete(null)
    }
  }

  const handleProjectDelete = async () => {
    setShowDeleteProjectDialog(true)
  }

  const confirmDeleteProject = async () => {
    await onDelete(project.id)
  }

  const handleAddTodo = async (text) => {
    await onAddTodo(project.id, text)
    setShowTodoForm(false)
  }

  const handleProjectClick = () => {
    router.push(`/projects/${project.id}`)
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <>
      <div 
        className="cursor-pointer group/card"
        onClick={handleProjectClick}
      >
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group group-hover/card:scale-[1.02] group-hover/card:shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors duration-300">
                    {project.title}
                  </CardTitle>
                  <ExternalLink className="h-4 w-4 text-slate-400 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                </div>
                {project.description && (
                  <CardDescription className="text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {project.description}
                  </CardDescription>
                )}
              </div>
              
              <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 group-hover:bg-gray-100 dark:group-hover:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-300"
                    >
                      <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent 
                    align="end" 
                    className="w-48 p-1 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                  >
                    <DropdownMenuItem asChild>
                      <div 
                        onClick={handleProjectClick}
                        className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors duration-200"
                      >
                        <ExternalLink className="mr-3 h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-700 dark:text-gray-300">Ver Projeto</span>
                      </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <div 
                        onClick={() => setShowEditForm(true)}
                        className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors duration-200"
                      >
                        <Edit className="mr-3 h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-700 dark:text-gray-300">Editar</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <div 
                        onClick={handleProjectDelete}
                        className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors duration-200 text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="mr-3 h-4 w-4" />
                        <span>Excluir</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
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
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Progress Bar */}
            {totalTodos > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Progresso</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {completedTodos}/{totalTodos} tarefas
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

  
          </CardContent>
        </Card>
      </div>

      {/* Edit Project Modal */}
      <ProjectForm
        project={project}
        isEditing={true}
        onSubmit={(data) => {
          onUpdate(project.id, data)
          setShowEditForm(false)
        }}
        onCancel={() => setShowEditForm(false)}
        open={showEditForm}
        onOpenChange={setShowEditForm}
      />

      {/* Delete Project Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteProjectDialog}
        onOpenChange={setShowDeleteProjectDialog}
        title="Excluir Projeto"
        description={`Tem certeza que deseja excluir o projeto "${project.title}"? Esta ação não pode ser desfeita e todas as tarefas associadas serão removidas.`}
        confirmText="Excluir Projeto"
        cancelText="Cancelar"
        onConfirm={confirmDeleteProject}
        variant="danger"
      />

      {/* Delete Todo Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteTodoDialog}
        onOpenChange={setShowDeleteTodoDialog}
        title="Excluir Tarefa"
        description="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
        confirmText="Excluir Tarefa"
        cancelText="Cancelar"
        onConfirm={confirmDeleteTodo}
        variant="danger"
      />
    </>
  )
} 