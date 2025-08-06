"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FolderOpen, 
  PlayCircle, 
  CheckCircle, 
  PauseCircle
} from "lucide-react"

export function DashboardStats({ stats }) {
  const statCards = [
    {
      title: "Total de Projetos",
      value: stats.total,
      description: "Todos os projetos",
      icon: FolderOpen,
      color: "text-blue-600"
    },
    {
      title: "Em Andamento",
      value: stats.emAndamento,
      description: "Projetos ativos",
      icon: PlayCircle,
      color: "text-green-600"
    },
    {
      title: "Concluídos",
      value: stats.concluido,
      description: "Projetos finalizados",
      icon: CheckCircle,
      color: "text-emerald-600"
    },
    {
      title: "Pausados",
      value: stats.pausado,
      description: "Projetos em espera",
      icon: PauseCircle,
      color: "text-orange-600"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => {
        const Icon = card.icon
        
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 