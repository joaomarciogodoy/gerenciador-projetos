"use client"

import { useState, useEffect } from "react"
import { ProjectCard } from "./ProjectCard"
import { ProjectForm } from "./ProjectForm"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Plus, Search, FolderOpen, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react"

export function ProjectManager({ showNewProjectForm, onShowNewProjectFormChange, onProjectChange }) {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingProject, setEditingProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Carregar projetos do banco
  const loadProjects = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/projects', {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar projetos')
      }

      const data = await response.json()
      setProjects(data.projects || [])
      setFilteredProjects(data.projects || [])
    } catch (error) {
      console.error('Erro ao carregar projetos:', error)
      setError('Erro ao carregar projetos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  // Filtrar projetos
  useEffect(() => {
    let filtered = projects

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, statusFilter])

  // Criar projeto
  const handleCreateProject = async (projectData) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar projeto')
      }

      const data = await response.json()
      setProjects(prev => [data.project, ...prev])
      onShowNewProjectFormChange(false)
      
      // Notificar mudança para atualizar a badge
      if (onProjectChange) {
        onProjectChange()
      }
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      setError(error.message)
    }
  }

  // Atualizar projeto
  const handleUpdateProject = async (id, projectData) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar projeto')
      }

      const data = await response.json()
      setProjects(prev => prev.map(p => p.id === id ? data.project : p))
      setEditingProject(null)
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error)
      setError(error.message)
    }
  }

  // Deletar projeto
  const handleDeleteProject = async (id) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao deletar projeto')
      }

      setProjects(prev => prev.filter(p => p.id !== id))
      
      // Notificar mudança para atualizar a badge
      if (onProjectChange) {
        onProjectChange()
      }
    } catch (error) {
      console.error('Erro ao deletar projeto:', error)
      setError(error.message)
    }
  }

  // Adicionar todo
  const handleAddTodo = async (projectId, text) => {
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
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, todos: [...p.todos, data.todo] }
          : p
      ))
    } catch (error) {
      console.error('Erro ao adicionar todo:', error)
      setError(error.message)
    }
  }

  // Atualizar todo
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
      setProjects(prev => prev.map(p => ({
        ...p,
        todos: p.todos.map(t => t.id === todoId ? data.todo : t)
      })))
    } catch (error) {
      console.error('Erro ao atualizar todo:', error)
      setError(error.message)
    }
  }

  // Deletar todo
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

      setProjects(prev => prev.map(p => ({
        ...p,
        todos: p.todos.filter(t => t.id !== todoId)
      })))
    } catch (error) {
      console.error('Erro ao deletar todo:', error)
      setError(error.message)
    }
  }

  // Calcular estatísticas
  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'IN_PROGRESS').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    paused: projects.filter(p => p.status === 'PAUSED').length,
    cancelled: projects.filter(p => p.status === 'CANCELLED').length,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Projetos</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Gerencie seus projetos e tarefas
          </p>
        </div>
        <Button 
          onClick={() => onShowNewProjectFormChange(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <FolderOpen className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-200 dark:border-yellow-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{stats.inProgress}</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Em Andamento</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.completed}</p>
                <p className="text-sm text-green-700 dark:text-green-300">Concluídos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200 dark:border-orange-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.paused}</p>
                <p className="text-sm text-orange-700 dark:text-orange-300">Pausados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-200 dark:border-red-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <XCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.cancelled}</p>
                <p className="text-sm text-red-700 dark:text-red-300">Cancelados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <Input
            type="search"
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 dark:focus:border-blue-400"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
        <SelectContent>
  <SelectItem 
    value="all"
    className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
  >
    Todos os Status
  </SelectItem>

  <SelectItem 
    value="IN_PROGRESS"
    className="hover:bg-yellow-100 dark:hover:bg-yellow-900/20 cursor-pointer"
  >
    Em Andamento
  </SelectItem>

  <SelectItem 
    value="PAUSED"
    className="hover:bg-orange-100 dark:hover:bg-orange-900/20 cursor-pointer"
  >
    Pausado
  </SelectItem>

  <SelectItem 
    value="COMPLETED"
    className="hover:bg-green-100 dark:hover:bg-green-900/20 cursor-pointer"
  >
    Concluído
  </SelectItem>

  <SelectItem 
    value="CANCELLED"
    className="hover:bg-red-100 dark:hover:bg-red-900/20 cursor-pointer"
  >
    Cancelado
  </SelectItem>
</SelectContent>

        </Select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600">
          <CardContent className="p-8 text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Nenhum projeto encontrado
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {projects.length === 0 
                ? "Comece criando seu primeiro projeto!"
                : "Tente ajustar os filtros de busca."
              }
            </p>
            {projects.length === 0 && (
              <Button 
                onClick={() => onShowNewProjectFormChange(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Projeto
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onUpdate={handleUpdateProject}
              onDelete={handleDeleteProject}
              onAddTodo={handleAddTodo}
              onUpdateTodo={handleUpdateTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          ))}
        </div>
      )}

      {/* New Project Modal */}
      <ProjectForm
        onSubmit={handleCreateProject}
        onCancel={() => onShowNewProjectFormChange(false)}
        open={showNewProjectForm}
        onOpenChange={onShowNewProjectFormChange}
      />

      {/* Edit Project Modal */}
      {editingProject && (
        <ProjectForm
          project={editingProject}
          isEditing={true}
          onSubmit={(data) => handleUpdateProject(editingProject.id, data)}
          onCancel={() => setEditingProject(null)}
          open={!!editingProject}
          onOpenChange={(open) => !open && setEditingProject(null)}
        />
      )}
    </div>
  )
} 