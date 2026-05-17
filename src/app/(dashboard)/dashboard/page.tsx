import { redirect } from "next/navigation";
import { BarChart3, Flame, Medal, Trophy } from "lucide-react";

import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ConnectLeetCodeForm } from "@/features/profile/components/connect-leetcode-form";
import { ReadinessScoreCard } from "@/features/analytics/components/readiness-score-card";
import { DailyGoalCard } from "@/features/goals/components/daily-goal-card";
import { DifficultyDistributionChart } from "@/features/dashboard/components/difficulty-distribution-chart";
import { MonthlyProgressChart } from "@/features/dashboard/components/monthly-progress-chart";
import { ProgressOverTimeChart } from "@/features/dashboard/components/progress-over-time-chart";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { SubmissionHeatmap } from "@/features/dashboard/components/submission-heatmap";
import { TopicWeaknessChart } from "@/features/dashboard/components/topic-weakness-chart";
import { getDashboardData } from "@/services/dashboard/data";

function formatNumber(value: number | null) {
  if (value === null) return "--";
  return new Intl.NumberFormat("en", { notation: value > 9999 ? "compact" : "standard" }).format(value);
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const dashboard = await getDashboardData(session.user.id);

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
        <div className="rounded-2xl border bg-card/70 p-6 shadow-xl shadow-black/5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={dashboard.connected ? "default" : "outline"}>{dashboard.connected ? "Live profile" : "Demo preview"}</Badge>
            {dashboard.lastSyncedAt ? <Badge variant="secondary">Synced {new Date(dashboard.lastSyncedAt).toLocaleString()}</Badge> : null}
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Your LeetCode operating system</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Track solved counts, streaks, contest movement, topic depth, and readiness from one focused dashboard.
          </p>
          {dashboard.syncError ? <p className="mt-4 text-sm text-destructive">Last sync error: {dashboard.syncError}</p> : null}
        </div>
        <ConnectLeetCodeForm connected={dashboard.connected} username={dashboard.connected ? dashboard.username : undefined} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total solved" value={dashboard.stats.totalSolved} detail={`${dashboard.stats.easySolved} easy / ${dashboard.stats.mediumSolved} medium / ${dashboard.stats.hardSolved} hard`} icon={BarChart3} />
        <StatCard title="Current streak" value={`${dashboard.stats.currentStreak}d`} detail={`Best streak ${dashboard.stats.maxStreak} days`} icon={Flame} />
        <StatCard title="Contest rating" value={formatNumber(dashboard.stats.contestRating)} detail="Pulled from public contest ranking" icon={Trophy} />
        <StatCard title="Ranking" value={formatNumber(dashboard.stats.ranking)} detail={`${dashboard.stats.acceptanceRate ?? 0}% acceptance rate`} icon={Medal} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ProgressOverTimeChart data={dashboard.overTime} />
        <TopicWeaknessChart data={dashboard.topicStats} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-4 lg:grid-cols-2">
          <DifficultyDistributionChart stats={dashboard.stats} />
          <MonthlyProgressChart data={dashboard.monthlyProgress} />
        </div>
        <ReadinessScoreCard topicStats={dashboard.topicStats} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <SubmissionHeatmap data={dashboard.calendar} />
        <DailyGoalCard calendar={dashboard.calendar} streak={dashboard.stats.currentStreak} />
      </section>

      <Card>
        <CardContent className="grid gap-3 py-4 text-sm text-muted-foreground md:grid-cols-3">
          <p><span className="font-medium text-foreground">Weakest topic:</span> {dashboard.topicStats.toSorted((a, b) => a.solved - b.solved)[0]?.topic ?? "n/a"}</p>
          <p><span className="font-medium text-foreground">Strongest topic:</span> {dashboard.topicStats.toSorted((a, b) => b.solved - a.solved)[0]?.topic ?? "n/a"}</p>
          <p><span className="font-medium text-foreground">Suggested next topic:</span> Dynamic Programming</p>
        </CardContent>
      </Card>
    </main>
  );
}
