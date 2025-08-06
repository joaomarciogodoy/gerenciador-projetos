"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, Trash2 } from "lucide-react"

export function ConfirmDialog({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  onConfirm,
  variant = "default" // "default" | "danger"
}) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              variant === "danger" 
                ? "bg-red-100 dark:bg-red-900/30" 
                : "bg-blue-100 dark:bg-blue-900/30"
            }`}>
              {variant === "danger" ? (
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-600 dark:text-slate-400 pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={`${
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            } shadow-md hover:shadow-lg transition-all duration-200`}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 