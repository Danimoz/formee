/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, FormEvent } from "react";
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [loading, setLoading] = useState(false)
  const { push } = useRouter();
  const [error, setError] = useState<Record<string, string> | null>(null)

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(event.currentTarget)
    const fullName = (formData.get('fullName') as string)?.trim()
    const email = (formData.get('email') as string)?.trim()
    const password = (formData.get('password') as string)?.trim()
    const confirmPassword = (formData.get('confirmPassword') as string)?.trim()

    // Basic client-side validation
    const errors: Record<string, string> = {}
    if (password !== confirmPassword) {
      errors.password = "Passwords don't match"
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters"
    }

    if (Object.keys(errors).length > 0) {
      setError((prev) => ({ ...prev, ...errors }))
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'An error occurred')
      }

      push('/login')
    } catch (err: any) {
      toast.error(err?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="flex flex-col gap-2.5">
      <Card className="max-w-sm md:max-w-3xl">
        <CardContent className="p-0">
          <form className="p-6 md:p-8" onSubmit={handleSignUp}>
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
              <p className="text-balance text-muted-foreground">Sign up to get started</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Full Name</Label>
                <Input id="fullName"  name="fullName" placeholder="Enter your Full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="Enter your email address" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name='password' placeholder="Enter your password" required />
                {error?.password && <p className="text-red-500">{error.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Confirm Password</Label>
                <Input id="confirmPassword" type="password" name='confirmPassword' placeholder="Enter your password" required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={24} /> : "Sign Up"}
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
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">Login</Link>
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
