'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { sendResetEmail } from './actions'
import { Loader2, Mail, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetEmail = email.trim()
    if (!targetEmail) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const result = await sendResetEmail(targetEmail)

      if (result.success) {
        // Show immediate success toast
        toast({
          title: "Password reset link sent",
          description: "A recovery link has been sent to your email address. Please check your inbox.",
        })

        // Give the user a moment to see the success state, then redirect
        setTimeout(() => {
          router.push('/signin?message=Password reset link sent to your email address.')
        }, 2500)
      } else {
        setErrorMessage(result.message)
        toast({
          title: "Request failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error('[FORGOT-PASSWORD] unexpected error:', error)
      const msg = 'An unexpected error occurred. Please try again.'
      setErrorMessage(msg)
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white text-slate-900">
      <Card className="w-full max-w-md border border-slate-200 shadow-xl shadow-slate-200/50 bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            {isSuccess ? 'Check your email' : 'Forgot Password'}
          </CardTitle>
          <CardDescription className="text-sm text-slate-600">
            {isSuccess
              ? `Verification link sent to ${email}`
              : "Enter your email to receive reset instructions."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" key={isSuccess ? 'success-view' : 'input-view'}>
          {isSuccess ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex flex-col items-center justify-center py-4 space-y-4 text-center">
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center pulse-animation">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-900">
                    Email Request Successful
                  </p>
                  <p className="text-sm text-slate-600 px-2">
                    A recovery link has been sent. Check your inbox and spam folder. The link is valid for 1 hour.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-11 border-slate-200 hover:bg-slate-50 text-slate-900 cursor-pointer"
                  onClick={() => setIsSuccess(false)}
                >
                  Entered wrong email? Try again
                </Button>
                <div className="text-center">
                  <Link
                    href="/signin"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Back to login
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {errorMessage && (
                <Alert variant="destructive" className="bg-rose-50 border border-rose-200">
                  <AlertDescription className="text-rose-800">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@exXXXX.com"
                      className="pl-11 h-12 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] font-semibold cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending Instructions...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
              <div className="text-center pt-2">
                <Link
                  href="/signin"
                  className="text-sm text-slate-600 inline-flex items-center gap-1"
                >
                  Suddenly remembered? <span className="font-medium text-blue-600">Back to login</span>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}