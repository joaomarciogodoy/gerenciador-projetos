"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

export function DashboardHeader({ onToggleSidebar, sidebarExpanded }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-4 lg:px-6">
        {/* Toggle Sidebar Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
        >
          {sidebarExpanded ? (
            <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          )}
          <span className="sr-only">
            {sidebarExpanded ? "Recolher sidebar" : "Expandir sidebar"}
          </span>
        </Button>
        
        <Separator orientation="vertical" className="mx-2 h-4 bg-slate-200 dark:bg-slate-700" />
        
        <div className="flex-1">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <Input
              type="search"
              placeholder="Buscar projetos..."
              className="pl-8 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 dark:focus:border-blue-400"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {isLoading ? "Carregando..." : `Olá, ${user?.name || user?.email || "Usuário"}`}
          </div>
        </div>
      </div>
    </header>
  )
} 