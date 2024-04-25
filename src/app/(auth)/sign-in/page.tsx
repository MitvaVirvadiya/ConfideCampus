'use client'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDebounceCallback } from 'usehooks-ts'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { loginSchema } from "@/schema/loginSchema"
import { signIn } from "next-auth/react"


const SignInPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()
    const { toast } = useToast()
    const form = useForm<z.infer <typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = async (data: z.infer <typeof  loginSchema>) => {
        // setIsSubmitting(true)
        
        const result = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password
        })

        if (result?.error) {
          if (result.error === 'CredentialsSignin') {
            toast({
              title: 'Login Failed',
              description: 'Incorrect username/email or password',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Error',
              description: result.error,
              variant: 'destructive',
            });
          }
        }
    
        if (result?.url) {
          router.replace('/dashboard');
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join ConfideCampus</h1>
                <p className="mb-4 text-gray-800">Sign in to share feedback with your peers and teachers</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username/Email</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter username or email" {...field}  />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {
                        isSubmitting ? (
                            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in
                            </>
                        ) : ( "Signin" )
                    }
                </Button>
                </form>
            </Form>
            <div className="text-center mt-4">
                <p> 
                   Not a member?{' '}
                   <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 hover:underline hover:cursor-pointer">register here</Link> 
                </p>
            </div>
        </div>
    </div>
  )
}

export default SignInPage