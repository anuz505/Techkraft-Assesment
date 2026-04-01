import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/properties", label: "Properties" },
  { to: "/favorites", label: "Favorites" },
]

function AppNavbar() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
      navigate("/signin", { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-6 py-3 sm:px-10">
        <div className="flex items-center gap-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]">TechKraft</p>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <p className="hidden text-sm text-muted-foreground sm:block">{user?.username}</p>
          <Button type="button" variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Logging out..." : "Log out"}
          </Button>
        </div>
      </div>
    </header>
  )
}

export default AppNavbar