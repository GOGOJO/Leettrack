import type { CalendarDay, CompanyStat, TopicStat } from "@/types/leetcode";

export type DashboardStats = {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  currentStreak: number;
  maxStreak: number;
  contestRating: number | null;
  ranking: number | null;
  acceptanceRate: number | null;
};

export type TimeSeriesPoint = {
  date: string;
  total: number;
};

export type MonthlyProgressPoint = {
  month: string;
  solved: number;
};

export type DashboardData = {
  connected: boolean;
  username?: string;
  stats: DashboardStats;
  overTime: TimeSeriesPoint[];
  monthlyProgress: MonthlyProgressPoint[];
  calendar: CalendarDay[];
  topicStats: TopicStat[];
  companyStats: CompanyStat[];
  lastSyncedAt?: string;
  syncError?: string | null;
};
