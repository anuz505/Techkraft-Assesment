import { Outlet } from "react-router-dom"
import AppNavbar from "@/components/layout/AppNavbar"

function ProtectedLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <Outlet />
    </div>
  )
}

export default ProtectedLayout