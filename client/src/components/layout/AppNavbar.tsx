import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { Menu, X } from "lucide-react"
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
      navigate("/signin", { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleNavClick = () => {
    closeMobileMenu()
  }

  const handleLogoutClick = async () => {
    closeMobileMenu()
    await handleLogout()
  }

  return (
    <header className="border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]">TechKraft</p>
          <div className="flex items-center gap-2 md:hidden">
            <p className="hidden text-sm text-muted-foreground sm:block">{user?.username}</p>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
          <div className="hidden items-center gap-6 md:flex">
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
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">{user?.username}</p>
              <Button type="button" variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? "Logging out..." : "Log out"}
              </Button>
            </div>
          </div>
        </div>
        <div id="mobile-navigation" className={`md:hidden ${isMobileMenuOpen ? "mt-4 block" : "hidden"}`}>
          <div className="rounded-2xl border bg-background p-3 shadow-sm">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                      isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-3 border-t pt-3">
              <p className="px-4 text-sm text-muted-foreground">{user?.username}</p>
              <Button
                type="button"
                variant="outline"
                className="mt-3 w-full"
                onClick={handleLogoutClick}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Log out"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppNavbar