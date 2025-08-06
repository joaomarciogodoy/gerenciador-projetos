"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon, X } from "lucide-react"

export function TodoForm({ onSubmit, onCancel }) {
  const [todoText, setTodoText] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!todoText.trim()) return
    
    onSubmit(todoText.trim())
    setTodoText("")
  }

  const handleCancel = () => {
    setTodoText("")
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
        placeholder="Adicionar nova tarefa..."
        className="flex-1 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 dark:focus:border-blue-400"
        autoFocus
      />
      <Button 
        type="submit" 
        size="sm"
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
        disabled={!todoText.trim()}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
      {onCancel && (
        <Button 
          type="button" 
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </form>
  )
} 