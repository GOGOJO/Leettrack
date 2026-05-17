import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignInButtons } from "@/components/auth/sign-in-buttons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-6">
      <Card className="w-full max-w-md shadow-2xl shadow-black/20">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to LeetTrack</CardTitle>
          <CardDescription>Sign in to connect your LeetCode username and start tracking progress.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButtons />
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Configure Google and GitHub OAuth credentials in your environment before testing provider login.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
