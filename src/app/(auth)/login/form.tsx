'use client'

import { FormEvent, useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const { replace } = useRouter()
  
  const handleCredentialSignin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const target = event.target as HTMLFormElement
    const email = target.email.value.trim()
    const password = target.password.value.trim()
    const result = await signIn("credentials", { email, password, redirect: false })
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
      return
    }
    // Redirect to the user's dashboard
    replace('/dashboard')
    setLoading(false)
  }
  
  return (
    <div className="flex flex-col gap-2.5">
      <Card className="max-w-sm md:max-w-3xl">
        <CardContent className="p-0">
          <form className="p-6 md:p-8" onSubmit={handleCredentialSignin}>
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
              <p className="text-balance text-muted-foreground">Sign in to your account to continue</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="Enter your email address" required />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" className="text-balance text-sm">Forgot Password?</Link>
                </div>
                <Input id="password" type="password" name='password' placeholder="Enter your password" required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={24} /> : "Sign In" }
              </Button>
            </div>
          </form>
          <div className="space-y-3 px-6">
            <div className="flex items-center">
              <div className="border border-t w-full" />
              <span className="flex-shrink-0 px-4 text-sm text-muted-foreground">or</span>
              <div className="border border-t w-full" />
            </div>
            <div className="flex justify-center">
              <Button variant='outline' onClick={() => signIn("google", { redirectTo: `${window.location.origin}/dashboard` })}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                <span>Continue with Google</span>
              </Button>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{"  "}
              <Link href="#" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center text-balance text-center [&_a]:mx-1 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary ">
        By clicking continue, you agree to our <Link href="#">Terms of Service</Link> and  <Link href="#">Privacy Policy</Link>
      </div>
    </div>
  )
}