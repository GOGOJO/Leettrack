"use client";

import { useMemo } from "react";
import { Award, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CalendarDay } from "@/types/leetcode";

export function DailyGoalCard({ calendar, target = 2, streak }: { calendar: CalendarDay[]; target?: number; streak: number }) {
  const todayCount = useMemo(() => calendar.at(-1)?.count ?? 0, [calendar]);
  const progress = Math.min(100, (todayCount / target) * 100);

  return (
    <Card id="goals">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Daily goal</CardTitle>
            <CardDescription>Solve {target} problems per day.</CardDescription>
          </div>
          <Target className="size-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span>{todayCount} solved today</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary"><Award className="size-3" /> {streak} day streak</Badge>
          <Badge variant="outline">Consistency builder</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
