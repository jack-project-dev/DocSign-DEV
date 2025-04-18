"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileSignature } from "lucide-react"

export default function AppHeader() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("username")
    router.push("/")
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileSignature className="h-6 w-6 text-gray-900" />
          <span className="text-xl font-bold text-gray-900">DocSign</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  )
}
