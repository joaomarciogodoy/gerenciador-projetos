"use client"

import { AuthGuard } from "@/components/AuthGuard"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { ProjectManager } from "@/components/ProjectManager"
import { useState } from "react"

export default function HomePage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [selectedView, setSelectedView] = useState("dashboard")
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)
  const [refreshSidebar, setRefreshSidebar] = useState(0)

  const handleToggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  const handleViewChange = (view) => {
    setSelectedView(view)
  }

  const handleNewProject = () => {
    setShowNewProjectForm(true)
  }

  const handleProjectChange = () => {
    // Força a atualização da badge do sidebar
    setRefreshSidebar(prev => prev + 1)
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <DashboardSidebar 
          selectedView={selectedView}
          onViewChange={handleViewChange}
          isExpanded={sidebarExpanded}
          onNewProject={handleNewProject}
          refreshTrigger={refreshSidebar}
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader 
            onToggleSidebar={handleToggleSidebar}
            sidebarExpanded={sidebarExpanded}
          />
          
          <main className="flex-1 overflow-auto p-6">
            {selectedView === "dashboard" && (
              <ProjectManager 
                showNewProjectForm={showNewProjectForm}
                onShowNewProjectFormChange={setShowNewProjectForm}
                onProjectChange={handleProjectChange}
              />
            )}
            {selectedView === "projects" && (
              <ProjectManager 
                showNewProjectForm={showNewProjectForm}
                onShowNewProjectFormChange={setShowNewProjectForm}
                onProjectChange={handleProjectChange}
              />
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}