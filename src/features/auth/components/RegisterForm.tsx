"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, Mail, User, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 ring-1 ring-green-500/20">
              <CheckCircle2 className="size-8 text-green-500" />
            </div>
            <div>
              <h1 className="text-foreground text-3xl font-bold tracking-tight">
                Registration successful!
              </h1>
              <p className="text-muted-foreground mt-2">Redirecting to login...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand Section */}
        <div className="space-y-2 text-center">
          <div className="from-primary/20 to-primary/5 ring-border mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ring-1">
            <Sparkles className="text-primary size-8" />
          </div>
          <div>
            <h1 className="text-foreground text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-muted-foreground mt-2">Enter your details to get started</p>
          </div>
        </div>

        {/* Register Card */}
        <Card className="border-border/50 bg-card/50 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold">Sign up</CardTitle>
            <CardDescription>Fill in the information below to create your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-5">
              {error && (
                <div className="bg-destructive/10 border-destructive/20 text-destructive flex items-center gap-2 rounded-lg border p-4 text-sm">
                  <Lock className="size-4" />
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <div className="relative">
                  <User className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="h-11 pl-10"
                    {...register("name")}
                    disabled={isLoading}
                  />
                </div>
                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="h-11 pl-10"
                    {...register("email")}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11 pl-10"
                    {...register("password")}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="h-11 pl-10"
                    {...register("confirmPassword")}
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="mt-5 flex flex-col space-y-4 pt-5">
              <Button
                type="submit"
                className="h-11 w-full text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create account
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
