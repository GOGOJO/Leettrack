import { format, fromUnixTime, subMonths } from "date-fns";

import { prisma } from "@/lib/prisma";
import type { DashboardData } from "@/types/dashboard";
import type { TopicStat } from "@/types/leetcode";
import { calendarToDays } from "@/services/leetcode/normalize";

export const demoTopicStats: TopicStat[] = [
  { topic: "Arrays", solved: 36, attempted: 40, acceptanceRate: 90, recentSolved: 6, easy: 12, medium: 18, hard: 6 },
  { topic: "Graphs", solved: 13, attempted: 26, acceptanceRate: 50, recentSolved: 2, easy: 3, medium: 8, hard: 2 },
  { topic: "Dynamic Programming", solved: 5, attempted: 22, acceptanceRate: 23, recentSolved: 1, easy: 1, medium: 3, hard: 1 },
  { topic: "Trees", solved: 18, attempted: 24, acceptanceRate: 75, recentSolved: 3, easy: 7, medium: 9, hard: 2 },
  { topic: "Binary Search", solved: 16, attempted: 20, acceptanceRate: 80, recentSolved: 3, easy: 6, medium: 8, hard: 2 },
];

export function getDemoDashboardData(): DashboardData {
  const now = new Date();
  const calendar = Array.from({ length: 120 }, (_, index) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (119 - index));
    return { date: format(day, "yyyy-MM-dd"), count: (index * 7) % 5 };
  });

  return {
    connected: false,
    username: "demo_user",
    stats: {
      totalSolved: 248,
      easySolved: 93,
      mediumSolved: 126,
      hardSolved: 29,
      currentStreak: 11,
      maxStreak: 31,
      contestRating: 1548,
      ranking: 84210,
      acceptanceRate: 63.8,
    },
    overTime: Array.from({ length: 8 }, (_, index) => ({
      date: format(subMonths(now, 7 - index), "MMM"),
      total: 80 + index * 22 + (index % 2) * 9,
    })),
    monthlyProgress: Array.from({ length: 6 }, (_, index) => ({
      month: format(subMonths(now, 5 - index), "MMM"),
      solved: 12 + index * 4 + (index % 2) * 5,
    })),
    calendar,
    topicStats: demoTopicStats,
    companyStats: [
      { company: "Google", solved: 18, attempted: 25 },
      { company: "Meta", solved: 15, attempted: 22 },
      { company: "Amazon", solved: 21, attempted: 30 },
    ],
  };
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const profile = await prisma.leetcodeProfile.findUnique({
    where: { userId },
    include: {
      snapshots: {
        orderBy: { capturedAt: "asc" },
        take: 24,
      },
    },
  });

  if (!profile) {
    return getDemoDashboardData();
  }

  const calendar = profile.submissionCalendar as Record<string, number>;
  const topicStats = profile.topicStats as TopicStat[];

  return {
    connected: true,
    username: profile.username,
    stats: {
      totalSolved: profile.totalSolved,
      easySolved: profile.easySolved,
      mediumSolved: profile.mediumSolved,
      hardSolved: profile.hardSolved,
      currentStreak: profile.currentStreak,
      maxStreak: profile.maxStreak,
      contestRating: profile.contestRating,
      ranking: profile.ranking,
      acceptanceRate: profile.acceptanceRate,
    },
    overTime: profile.snapshots.map((snapshot) => ({
      date: format(snapshot.capturedAt, "MMM d"),
      total: snapshot.totalSolved,
    })),
    monthlyProgress: Object.entries(calendar)
      .reduce<Map<string, number>>((months, [timestamp, count]) => {
        const month = format(fromUnixTime(Number(timestamp)), "MMM");
        months.set(month, (months.get(month) ?? 0) + count);
        return months;
      }, new Map())
      .entries()
      .toArray()
      .map(([month, solved]) => ({ month, solved })),
    calendar: calendarToDays(calendar),
    topicStats,
    companyStats: profile.companyStats as DashboardData["companyStats"],
    lastSyncedAt: profile.lastSyncedAt?.toISOString(),
    syncError: profile.syncError,
  };
}
