"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/auth-card";
import { loginUser } from "@/lib/actions/user.actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await loginUser(formData);
    
    setIsSubmitting(false);

    if (result.ok) {
      router.push("/dashboard");
    } else {
       toast({
        variant: "destructive",
        title: "Login Failed",
        description: result.error,
      });
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-background">
      <AuthCard
        title="ChronoLog"
        description="Log in to access your future memories."
        footer={
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="underline text-accent hover:text-accent/80">
              Sign up
            </Link>
          </p>
        }
      >
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Logging In..." : "Login"}
          </Button>
        </form>
      </AuthCard>
    </main>
  );
}
