'use client'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { verifySchema } from "@/schema/verifySchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const verifyCodePage = () => {
    const [isChecking, setIsChecking] = useState(false)
    const params = useParams<{username: string}>()
    const router = useRouter()

    const { toast } = useToast()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsChecking(true)
        try {
            const response = await axios.post('/api/verify-user', {
                username: params.username,
                verifyCode: data.code
            })

             console.log(response);
            if(!response.data.success){
                toast({
                    title: "Verification Failed",
                    description: response.data.message,
                    variant: "destructive"
                })
            }

            toast({
                title: "Verifiaction Success",
                description: response.data.message,
            })
            router.replace('/sign-in')
        } catch (error) {
            console.error("Error while verifying code ", error);
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Verification Error",
                description: axiosError.response?.data.message,
                variant: "destructive"
            })
        } finally {
            setIsChecking(false)
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">verify Your Account</h1>
            <p className="mb-4 text-gray-800">Enter the Verification code sent to your email</p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter code" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={isChecking}>
                    {
                        isChecking ? 
                            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking
                            </>
                         :  "Verify" 
                    }
                </Button>
            </form>
        </Form>
        </div>
    </div>
  )
}

export default verifyCodePage