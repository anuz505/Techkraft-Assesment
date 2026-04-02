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
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 sm:p-10">
      <section className="rounded-2xl border bg-card p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold">Welcome back, {user?.username}</h1>
        <p className="mt-2 text-muted-foreground">You are signed in as {user?.email}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" onClick={() => navigate("/properties")}>Next: Go to properties</Button>
          <Button type="button" variant="outline" onClick={() => navigate("/favorites")}>My favorites</Button>
          <Button type="button" variant="outline" onClick={handleLogout}>Log out</Button>
        </div>
      </section>

      <div className="rounded-2xl border border-dashed p-6 text-muted-foreground">
        Use the Next button to browse properties.
      </div>
      <div className="rounded-2xl border border-dashed p-6 text-muted-foreground">
        Only admin accounts can add, edit, or delete properties.
      </div>
    </main>
  )
}

export default DashboardPage
