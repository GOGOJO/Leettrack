"use client";

import { signIn } from "next-auth/react";
import { Code2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SignInButtons() {
  return (
    <div className="grid gap-3">
      <Button size="lg" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
        Continue with Google
      </Button>
      <Button size="lg" variant="outline" onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>
        <Code2 className="size-4" />
        Continue with GitHub
      </Button>
    </div>
  );
}
