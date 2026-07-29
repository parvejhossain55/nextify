import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="bg-muted/50 flex min-h-screen items-center justify-center p-4">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold">Nextify</h1>
        <p className="text-muted-foreground">Production-ready Next.js boilerplate</p>
        <div className="space-x-4">
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
