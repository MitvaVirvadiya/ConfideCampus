'use client'
import { useToast } from "@/components/ui/use-toast"
import { signupSchema } from "@/schema/signUpSchema"
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


const SignUpPage = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debounced = useDebounceCallback(setUsername, 500)

    const router = useRouter()
    const { toast } = useToast()
    const form = useForm<z.infer <typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUsername = async () => {
            if(username){
                setIsCheckingUsername(true)
                setUsernameMessage('')

                try {
                    const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`)
                    console.log(response);
                    
                    setUsernameMessage(response.data.message)

                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? "Error while checking username")
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsername()
    }, [username])

    const onSubmit = async (data: z.infer <typeof  signupSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post('/api/signup', data)
            console.log(response);
            if(!response.data.success){
                toast({
                    title: "Signup Failed",
                    description: response.data.message,
                    variant: "destructive"
                })
            }

            toast({
                title: "Signup Success",
                description: response.data.message,
            })
            router.replace(`/verify/${username}`)
        } catch (error) {
            console.error("Error while user signup ", error);
            const axiosError = error as AxiosError<ApiResponse>
            let apiError = axiosError.response?.data.message
            toast({
                title: "Signup Error",
                description: apiError,
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join ConfideCampus</h1>
                <p className="mb-4 text-gray-800">Sign up to share feedback with your peers and teachers</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter username" {...field} onChange={(e) => {
                            field.onChange(e)
                            debounced(e.target.value)
                        }} />
                    </FormControl>
                    {
                        isCheckingUsername && <Loader2 className="animate-spin" /> 
                    }
                    <p className={`text-sm ${usernameMessage === "Username is available" ? 'text-green-500' : 'text-red-500' } `}>{usernameMessage}</p>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter email" {...field} />
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
                <Button type="submit">
                    {
                        isSubmitting ? (
                            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                            </>
                        ) : ( "Signup" )
                    }
                </Button>
                </form>
            </Form>
            <div className="text-center mt-4">
                <p> 
                   Already a member?{' '}
                   <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 hover:underline hover:cursor-pointer">Sign in</Link> 
                </p>
            </div>
        </div>
    </div>
  )
}

export default SignUpPage