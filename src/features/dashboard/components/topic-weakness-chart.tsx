"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TopicStat } from "@/types/leetcode";

export function TopicWeaknessChart({ data }: { data: TopicStat[] }) {
  const chartData = data.map((topic) => ({ topic: topic.topic, solved: topic.solved, acceptance: topic.acceptanceRate }));

  return (
    <Card id="analytics" className="min-h-96">
      <CardHeader>
        <CardTitle>Topic weakness chart</CardTitle>
        <CardDescription>Lower solved counts and acceptance rates show where to focus.</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: 4, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="topic" tickLine={false} axisLine={false} fontSize={12} interval={0} angle={-18} textAnchor="end" height={60} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
            <Bar dataKey="solved" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
