import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">LT</span>
            LeetTrack
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#overview">Overview</a>
            <a href="#analytics">Analytics</a>
            <a href="#goals">Goals</a>
          </nav>
          <SignOutButton />
        </div>
      </header>
      <Separator />
      {children}
    </div>
  );
}
