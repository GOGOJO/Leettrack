"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/types/dashboard";

export function DifficultyDistributionChart({ stats }: { stats: DashboardStats }) {
  const data = [
    { name: "Easy", value: stats.easySolved, color: "var(--chart-1)" },
    { name: "Medium", value: stats.mediumSolved, color: "var(--chart-3)" },
    { name: "Hard", value: stats.hardSolved, color: "var(--chart-5)" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Difficulty distribution</CardTitle>
        <CardDescription>Balance easy confidence with medium and hard depth.</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={70} outerRadius={105} paddingAngle={4} dataKey="value" label>
              {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
