import { format, parseISO, subDays } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { CalendarDay } from "@/types/leetcode";

function level(count: number) {
  if (count === 0) return "bg-muted";
  if (count < 2) return "bg-emerald-900";
  if (count < 4) return "bg-emerald-700";
  if (count < 6) return "bg-emerald-500";
  return "bg-emerald-300";
}

export function SubmissionHeatmap({ data }: { data: CalendarDay[] }) {
  const map = new Map(data.map((day) => [day.date, day.count]));
  const today = new Date();
  const days = Array.from({ length: 140 }, (_, index) => {
    const date = subDays(today, 139 - index);
    const key = format(date, "yyyy-MM-dd");
    return { date: key, count: map.get(key) ?? 0 };
  });

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Submission heatmap</CardTitle>
        <CardDescription>GitHub-style contribution graph for your recent LeetCode activity.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-2">
          {days.map((day) => (
            <Tooltip key={day.date}>
              <TooltipTrigger>
                <div className={cn("size-3 rounded-sm", level(day.count))} />
              </TooltipTrigger>
              <TooltipContent>
                {day.count} submissions on {format(parseISO(day.date), "MMM d, yyyy")}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
