"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  FolderOpen, 
  Plus, 
  Sparkles, 
  User, 
  LogOut,
  ChevronDown,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  LayoutDashboard
} from "lucide-react"

const STATUS_CONFIG = {
  IN_PROGRESS: {
    label: "Em Andamento",
    icon: Clock,
    color: "text-yellow-600 dark:text-yellow-400"
  },
  PAUSED: {
    label: "Pausado",
    icon: AlertTriangle,
    color: "text-orange-600 dark:text-orange-400"
  },
  COMPLETED: {
    label: "Concluído",
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400"
  },
  CANCELLED: {
    label: "Cancelado",
    icon: XCircle,
    color: "text-red-600 dark:text-red-400"
  }
}

export function DashboardSidebar({ selectedView, onViewChange, isExpanded = true, onNewProject, refreshTrigger }) {
  const router = useRouter()
  const [projectCount, setProjectCount] = useState(0)
  const [projects, setProjects] = useState([])
  const [userInfo, setUserInfo] = useState({
    name: "Usuário",
    email: "usuario@email.com"
  })

  // Buscar número de projetos, lista de projetos e informações do usuário
  const fetchData = async () => {
    try {
      // Buscar projetos
      const projectsResponse = await fetch('/api/projects', {
        credentials: 'include'
      })
      
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData.projects || [])
        setProjectCount(projectsData.projects?.length || 0)
      }

      // Buscar informações do usuário
      const userResponse = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUserInfo({
          name: userData.user?.name || "Usuário",
          email: userData.user?.email || "usuario@email.com"
        })
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [refreshTrigger]) // Recarrega quando refreshTrigger mudar

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        window.location.href = "/login"
      } else {
        console.error('Erro ao fazer logout')
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleProjectClick = (projectId) => {
    router.push(`/projects/${projectId}`)
  }

  const handleDashboardClick = () => {
    router.push('/')
  }

  const navItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: "projects",
      title: "Projetos",
      icon: FolderOpen,
      badge: projectCount
    }
  ]

  return (
    <aside className={`flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50/80 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900/90 border-r border-slate-200/60 dark:border-slate-700/60 transition-all duration-500 shadow-2xl backdrop-blur-sm ${
      isExpanded ? 'w-72' : 'w-16'
    }`}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/10 pointer-events-none" />
      
      {/* Logo Section */}
      <div className="relative flex h-16 shrink-0 items-center border-b border-slate-200/80 dark:border-slate-700/80 px-4 group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50/50 to-transparent dark:via-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center gap-3 z-10">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0 hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:rotate-6 ring-2 ring-white/20 backdrop-blur-sm">
            <span className="text-white font-bold text-sm drop-shadow-sm">GP</span>
          </div>
          {isExpanded && (
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent truncate">
                Gerencia
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 -mt-1 truncate font-medium">
                Projetos
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="relative flex flex-col gap-3 p-4 pt-6 group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/20 dark:from-blue-950/20 dark:to-purple-950/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl blur-xl" />
        <div className="relative z-10">
          <Button 
            size="sm" 
            onClick={onNewProject}
            className={`relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-700 hover:via-blue-600 hover:to-purple-700 shadow-lg hover:shadow-2xl transition-all duration-300 border-0 ring-1 ring-white/20 backdrop-blur-sm ${
              isExpanded ? 'flex-1 gap-2 h-12 text-sm font-semibold' : 'w-10 h-10 p-0 mx-auto'
            } group`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Plus className="h-4 w-4 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            {isExpanded && (
              <span className="relative z-10 drop-shadow-sm">Novo Projeto</span>
            )}
            <Sparkles className={`absolute top-1 right-1 h-3 w-3 text-white/60 opacity-0 group-hover:opacity-100 transition-all duration-300 ${!isExpanded && 'hidden'}`} />
          </Button>
        </div>
      </div>
      
      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-2 relative">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = selectedView === item.id
            
            return (
              <div key={item.id} className="group relative">
                {/* Active indicator */}
                {isActive && isExpanded && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full shadow-lg" />
                )}
                
                {item.id === "dashboard" ? (
                  // Dashboard button (simple button)
                  <Button
                    variant="ghost"
                    className={`relative w-full transition-all duration-300 overflow-hidden ${
                      isExpanded ? 'justify-start gap-3 h-12 px-4 pl-6' : 'w-10 h-10 p-0 mx-auto'
                    } ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-50 via-blue-50/80 to-purple-50/60 dark:from-blue-950/50 dark:via-blue-900/40 dark:to-purple-950/30 text-blue-700 dark:text-blue-300 shadow-lg ring-1 ring-blue-200/50 dark:ring-blue-800/30 backdrop-blur-sm' 
                        : 'hover:bg-gradient-to-r hover:from-slate-100/80 hover:to-slate-50 dark:hover:from-slate-800/60 dark:hover:to-slate-700/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:shadow-md hover:backdrop-blur-sm'
                    }`}
                    onClick={handleDashboardClick}
                    title={!isExpanded ? item.title : undefined}
                  >
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <Icon className={`h-5 w-5 flex-shrink-0 relative z-10 transition-all duration-300 ${
                      isActive 
                        ? 'text-blue-600 dark:text-blue-400 drop-shadow-sm' 
                        : 'group-hover:scale-110 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                    }`} />
                    
                    {isExpanded && (
                      <span className="font-semibold flex-1 text-left truncate relative z-10 tracking-wide">
                        {item.title}
                      </span>
                    )}
                  </Button>
                ) : (
                  // Projects dropdown
                  isExpanded ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`relative w-full transition-all duration-300 overflow-hidden justify-start gap-3 h-12 px-4 pl-6 ${
                            isActive 
                              ? 'bg-gradient-to-r from-blue-50 via-blue-50/80 to-purple-50/60 dark:from-blue-950/50 dark:via-blue-900/40 dark:to-purple-950/30 text-blue-700 dark:text-blue-300 shadow-lg ring-1 ring-blue-200/50 dark:ring-blue-800/30 backdrop-blur-sm' 
                              : 'hover:bg-gradient-to-r hover:from-slate-100/80 hover:to-slate-50 dark:hover:from-slate-800/60 dark:hover:to-slate-700/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:shadow-md hover:backdrop-blur-sm'
                          }`}
                          onClick={() => onViewChange(item.id)}
                        >
                          {/* Hover effect overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <Icon className={`h-5 w-5 flex-shrink-0 relative z-10 transition-all duration-300 ${
                            isActive 
                              ? 'text-blue-600 dark:text-blue-400 drop-shadow-sm' 
                              : 'group-hover:scale-110 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                          }`} />
                          
                          <span className="font-semibold flex-1 text-left truncate relative z-10 tracking-wide">
                            {item.title}
                          </span>
                          
                          <div className="flex items-center gap-2 relative z-10">
                            {item.badge > 0 && (
                              <Badge 
                                variant="secondary" 
                                className={`text-xs font-bold px-2.5 py-1 flex-shrink-0 transition-all duration-300 ${
                                  isActive
                                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 ring-1 ring-blue-200/50 dark:ring-blue-700/50'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-600'
                                }`}
                              >
                                {item.badge}
                              </Badge>
                            )}
                            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      
                      <DropdownMenuContent 
                        className="w-64 bg-white/95 dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60 shadow-2xl backdrop-blur-md rounded-2xl ring-1 ring-black/5 dark:ring-white/10" 
                        align="start"
                        side="right"
                        sideOffset={5}
                      >
                        <DropdownMenuLabel className="font-semibold text-slate-900 dark:text-white p-3">
                          Meus Projetos
                        </DropdownMenuLabel>
                        
                        <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700 mx-2" />
                        
                        {projects.length === 0 ? (
                          <div className="p-3 text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                              Nenhum projeto criado
                            </p>
                            <Button 
                              size="sm" 
                              onClick={onNewProject}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs"
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              Criar Projeto
                            </Button>
                          </div>
                        ) : (
                          <div className="max-h-64 overflow-y-auto">
                            {projects.map((project) => {
                              const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.IN_PROGRESS
                              const StatusIcon = statusConfig.icon
                              
                              return (
                                <DropdownMenuItem 
                                  key={project.id}
                                  onClick={() => handleProjectClick(project.id)}
                                  className="cursor-pointer p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 focus:bg-gradient-to-r focus:from-blue-50 focus:to-purple-50 dark:focus:from-blue-950/30 dark:focus:to-purple-950/30 rounded-xl transition-all duration-300 group/project backdrop-blur-sm"
                                >
                                  <div className="flex items-center gap-3 w-full">
                                    <div className={`p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 group-hover/project:bg-slate-200 dark:group-hover/project:bg-slate-600 transition-colors duration-300`}>
                                      <StatusIcon className={`h-3 w-3 ${statusConfig.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover/project:text-blue-600 dark:group-hover/project:text-blue-400 transition-colors duration-300">
                                        {project.title}
                                      </p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {statusConfig.label}
                                      </p>
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                              )
                            })}
                          </div>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      variant="ghost"
                      className={`relative w-full transition-all duration-300 overflow-hidden  h-10 p-0 mx-auto ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-50 via-blue-50/80 to-purple-50/60 dark:from-blue-950/50 dark:via-blue-900/40 dark:to-purple-950/30 text-blue-700 dark:text-blue-300 shadow-lg ring-1 ring-blue-200/50 dark:ring-blue-800/30 backdrop-blur-sm' 
                          : 'hover:bg-gradient-to-r hover:from-slate-100/80 hover:to-slate-50 dark:hover:from-slate-800/60 dark:hover:to-slate-700/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:shadow-md hover:backdrop-blur-sm'
                      }`}
                      onClick={() => onViewChange(item.id)}
                      title={item.title}
                    >
                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <Icon className={`h-5 w-5 flex-shrink-0 relative z-10 transition-all duration-300 ${
                        isActive 
                          ? 'text-blue-600 dark:text-blue-400 drop-shadow-sm' 
                          : 'group-hover:scale-110 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                      }`} />
                      
                      {item.badge > 0 && (
                        <Badge 
                          variant="secondary" 
                          className={`absolute -top-1 -right-1 text-xs font-bold px-1.5 py-0.5 flex-shrink-0 transition-all duration-300 ${
                            isActive
                              ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 ring-1 ring-blue-200/50 dark:ring-blue-700/50'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-600'
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  )
                )}
              </div>
            )
          })}
        </div>
      </nav>
      
      {/* User Profile */}
      <div className="relative border-t border-slate-200/80 dark:border-slate-700/80 p-4 group">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50/80 via-transparent to-transparent dark:from-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={`relative w-full hover:bg-gradient-to-r hover:from-slate-100/60 hover:to-slate-50/80 dark:hover:from-slate-800/60 dark:hover:to-slate-700/40 transition-all duration-300 group/profile overflow-hidden backdrop-blur-sm ${
                isExpanded ? 'justify-start gap-3 p-3 h-auto rounded-xl' : 'w-10 h-10 p-0 mx-auto rounded-xl'
              }`}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 to-purple-50/10 dark:from-blue-950/20 dark:to-purple-950/10 opacity-0 group-hover/profile:opacity-100 transition-opacity duration-300" />
              
              <Avatar className="h-9 w-9 ring-2 ring-slate-200/60 dark:ring-slate-600/60 flex-shrink-0 group-hover/profile:ring-blue-300/60 dark:group-hover/profile:ring-blue-500/40 transition-all duration-300 group-hover/profile:scale-110 shadow-lg relative z-10">
                <AvatarImage src="/avatars/user.jpg" alt="Usuário" />
                <AvatarFallback className="bg-gradient-to-tr from-blue-500 via-blue-400 to-purple-500 text-white font-semibold shadow-inner">
                  <User className="h-4 w-4 drop-shadow-sm" />
                </AvatarFallback>
              </Avatar>
              
              {isExpanded && (
                <div className="flex-1 min-w-0 text-left relative z-10">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover/profile:text-blue-600 dark:group-hover/profile:text-blue-400 transition-colors duration-300 tracking-wide">
                    {userInfo.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate group-hover/profile:text-slate-600 dark:group-hover/profile:text-slate-300 transition-colors duration-300 font-medium">
                    {userInfo.email}
                  </p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            className="w-64 bg-white/95 dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60 shadow-2xl backdrop-blur-md rounded-2xl ring-1 ring-black/5 dark:ring-white/10" 
            align="end" 
            forceMount
          >
            <DropdownMenuLabel className="font-normal p-5">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-blue-200/50 dark:ring-blue-700/50 shadow-lg">
                    <AvatarImage src="/avatars/user.jpg" alt="Usuário" />
                    <AvatarFallback className="bg-gradient-to-tr from-blue-500 via-blue-400 to-purple-500 text-white font-bold">
                      <User className="h-5 w-5 drop-shadow-sm" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">{userInfo.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{userInfo.email}</p>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700 mx-2" />
            
            <div className="p-2">
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100/50 dark:hover:from-red-950/50 dark:hover:to-red-900/30 focus:bg-gradient-to-r focus:from-red-50 focus:to-red-100/50 dark:focus:from-red-950/50 dark:focus:to-red-900/30 rounded-xl transition-all duration-300 font-semibold group/logout backdrop-blur-sm"
              >
                <LogOut className="mr-3 h-4 w-4 group-hover/logout:scale-110 transition-transform duration-300" />
                <span className="tracking-wide">Sair</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
