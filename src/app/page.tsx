import Link from "next/link";
import { ArrowRight, BarChart3, Brain, Code2, Flame, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  { title: "Live LeetCode sync", description: "Solved counts, streaks, rankings, contest rating, and recent submissions from your public profile.", icon: Flame },
  { title: "Topic analytics", description: "Find weak spots across Arrays, Graphs, Dynamic Programming, Trees, and more.", icon: BarChart3 },
  { title: "Interview readiness", description: "A weighted score turns activity, acceptance, and difficulty balance into a prep signal.", icon: Brain },
  { title: "Daily goals", description: "Track solve targets, current streaks, and progress toward a consistent habit.", icon: Target },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <section className="grid-bg relative px-6 py-6 sm:px-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background" />
        <div className="relative mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">LT</span>
            LeetTrack
          </Link>
          <div className="flex items-center gap-3">
            <Link className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")} href="/signin">
              Sign in
            </Link>
            <Link className={buttonVariants({ size: "lg" })} href="/dashboard">
              Open dashboard
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-12 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Badge variant="outline" className="mb-5 bg-background/80 backdrop-blur">
              GitHub + Linear + Notion inspired LeetCode analytics
            </Badge>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
              Turn LeetCode practice into a measurable interview plan.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Connect your username, sync coding progress over time, uncover weak topics, and keep daily goals visible with a polished analytics dashboard.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className={buttonVariants({ size: "lg" })} href="/dashboard">
                Start tracking
                <ArrowRight className="size-4" />
              </Link>
              <Link className={cn(buttonVariants({ variant: "outline", size: "lg" }), "bg-background/70")} href="https://github.com" target="_blank">
                <Code2 className="size-4" />
                OAuth ready
              </Link>
            </div>
          </div>

          <Card className="border-white/10 bg-card/80 shadow-2xl shadow-black/20 backdrop-blur">
            <CardHeader>
              <CardTitle>Today&apos;s readiness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {["Solved", "Streak", "Rating", "Ranking"].map((label, index) => (
                  <div key={label} className="rounded-xl border bg-background/60 p-4">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-2 text-2xl font-semibold">{[248, "11d", 1548, "84k"][index]}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border bg-background/60 p-4">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Interview Readiness</span>
                  <span className="font-medium">65/100</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 w-[65%] rounded-full bg-primary" />
                </div>
              </div>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between rounded-lg bg-muted/60 p-3"><span>Arrays</span><span>90</span></div>
                <div className="flex justify-between rounded-lg bg-muted/60 p-3"><span>Graphs</span><span>50</span></div>
                <div className="flex justify-between rounded-lg bg-muted/60 p-3"><span>Dynamic Programming</span><span>20</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-20 sm:px-10 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="bg-card/70">
            <CardHeader>
              <feature.icon className="size-5 text-muted-foreground" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">{feature.description}</CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
