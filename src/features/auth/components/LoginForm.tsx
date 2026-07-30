"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
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
import { Lock, Mail, ArrowRight, Sparkles } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand Section */}
        <div className="space-y-2 text-center">
          <div className="from-primary/20 to-primary/5 ring-border mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ring-1">
            <Sparkles className="text-primary size-8" />
          </div>
          <div>
            <h1 className="text-foreground text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 bg-card/50 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold">Sign in</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link href="/forgot-password" className="text-primary text-sm hover:underline">
                    Forgot password?
                  </Link>
                </div>
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
            </CardContent>
            <CardFooter className="mt-5 flex flex-col space-y-4 pt-5">
              <Button
                type="submit"
                className="h-11 w-full text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link href="/register" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
