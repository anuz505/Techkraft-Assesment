import { LoginForm } from '../login-form'

function SignIn() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <section className="hidden lg:flex flex-col justify-center px-16 bg-muted/30 border-r">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          TechKraft
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-balance">
          Assessment Project
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          This is a assessment project sign in page.
        </p>
        <span className='text-xs mt-1 text-muted-foreground'>This UI is pulled from shadcn UI component library</span>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </section>
    </div>
  )
}

export default SignIn
