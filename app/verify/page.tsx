"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "react-query"
import UserApi from "@/lib/api/user.api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"

interface VerifyUser {
  verifyToken: string
}

const VerifyPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const verifyToken = searchParams.get("verify")

  const userApi = new UserApi()

  const verifyUser = async (values: VerifyUser) => {
    return await userApi.verifyUser({userId: values.verifyToken})
  }

  const { mutate, isLoading, isError, error, isSuccess } = useMutation({
    mutationFn: verifyUser,
    onSuccess: () => {
      toast.success("Email verified successfully! You can now log in.")
      router.push("/")
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred during verification")
      if (error?.response?.status === 400) {
        router.push("/")
      }
    },
  })

  useEffect(() => {
    if (verifyToken) {
      mutate({ verifyToken })
    } else {
      toast.error("Invalid verification link")
      throw Error("No User")
    }
  }, [verifyToken, mutate, router])

  if (!verifyToken) {
    return null
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center items-center mb-6">
            <Image src="/airhub-logo.png" alt="AirHub logo" width={128} height={128} />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">We're verifying your email address...</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center">
              <p>Please wait while we verify your email...</p>
            </div>
          )}
          {isError && (
            <div className="text-center text-red-500">
              <p>An error occurred during verification. Please try again.</p>
              <Button onClick={() => mutate({ verifyToken: verifyToken! })} className="mt-4">
                Retry Verification
              </Button>
            </div>
          )}
          {isSuccess && (
            <div className="text-center text-green-500">
              <p>Your email has been successfully verified!</p>
              <Button onClick={() => router.push("/login")} className="mt-4">
                Proceed to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyPage

