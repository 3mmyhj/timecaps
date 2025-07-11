"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/auth-card";
import { useToast } from "@/hooks/use-toast";
import { signupUser } from "@/lib/actions/user.actions";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await signupUser(formData);

    setIsSubmitting(false);

    if (result.ok) {
      toast({
        title: "Account Created!",
        description: "You can now log in with your new account.",
      });
      router.push("/");
    } else {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: result.error,
      });
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-background">
      <AuthCard
        title="Create your Account"
        description="Begin your journey of preserving memories."
        footer={
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/" className="underline text-accent hover:text-accent/80">
              Login
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" placeholder="Your Name" required />
          </div>
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
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </AuthCard>
    </main>
  );
}
