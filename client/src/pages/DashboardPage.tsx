import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

function DashboardPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    navigate("/signin", { replace: true })
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-start justify-center gap-6 p-6 sm:p-10">
      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">TechKraft</p>
      <h1 className="text-3xl font-semibold">Welcome, {user?.username}</h1>
      <p className="text-muted-foreground">
        You are signed in as {user?.email} with role {user?.role}.
      </p>
      <Button onClick={handleLogout}>Log out</Button>
    </main>
  )
}

export default DashboardPage
