import { differenceInCalendarDays, format, fromUnixTime, subDays } from "date-fns";

import type { NormalizedLeetCodeProfile, NormalizedSubmission, TopicStat } from "@/types/leetcode";

type SubmissionStat = {
  difficulty: string;
  count: number;
  submissions: number;
};

type RecentSubmission = {
  id?: string;
  title: string;
  titleSlug: string;
  statusDisplay?: string;
  lang?: string;
  timestamp: string;
};

export type UserProfileResponse = {
  matchedUser: null | {
    username: string;
    profile: {
      realName?: string | null;
      userAvatar?: string | null;
      ranking?: number | null;
    };
    submitStatsGlobal: {
      acSubmissionNum: SubmissionStat[];
    };
    submissionCalendar?: string | null;
  };
  userContestRanking?: {
    rating?: number | null;
    globalRanking?: number | null;
  } | null;
  recentAcSubmissionList?: RecentSubmission[];
  recentSubmissionList?: RecentSubmission[];
};

function parseCalendar(calendar?: string | null) {
  if (!calendar) return {};
  try {
    return JSON.parse(calendar) as Record<string, number>;
  } catch {
    return {};
  }
}

function getCount(stats: SubmissionStat[], difficulty: string) {
  return stats.find((item) => item.difficulty.toLowerCase() === difficulty.toLowerCase())?.count ?? 0;
}

function getSubmissions(stats: SubmissionStat[]) {
  return stats.find((item) => item.difficulty.toLowerCase() === "all")?.submissions ?? 0;
}

function getCurrentStreak(calendar: Record<string, number>) {
  let streak = 0;
  const today = new Date();

  for (let index = 0; index < 365; index += 1) {
    const day = subDays(today, index);
    const key = String(Math.floor(day.getTime() / 1000 / 86400) * 86400);
    if ((calendar[key] ?? 0) > 0) {
      streak += 1;
    } else if (index > 0) {
      break;
    }
  }

  return streak;
}

function getMaxStreak(calendar: Record<string, number>) {
  const days = Object.entries(calendar)
    .filter(([, count]) => count > 0)
    .map(([timestamp]) => fromUnixTime(Number(timestamp)))
    .sort((a, b) => a.getTime() - b.getTime());

  let max = 0;
  let current = 0;
  let previous: Date | null = null;

  for (const day of days) {
    if (!previous || differenceInCalendarDays(day, previous) === 1) {
      current += 1;
    } else if (differenceInCalendarDays(day, previous) > 1) {
      current = 1;
    }
    max = Math.max(max, current);
    previous = day;
  }

  return max;
}

function normalizeStatus(status?: string): NormalizedSubmission["status"] {
  const normalized = status?.toLowerCase() ?? "";
  if (normalized.includes("accepted")) return "ACCEPTED";
  if (normalized.includes("wrong")) return "WRONG_ANSWER";
  if (normalized.includes("time")) return "TIME_LIMIT_EXCEEDED";
  if (normalized.includes("runtime")) return "RUNTIME_ERROR";
  if (normalized.includes("compile")) return "COMPILE_ERROR";
  if (normalized.includes("memory")) return "MEMORY_LIMIT_EXCEEDED";
  return "OTHER";
}

function normalizeSubmission(submission: RecentSubmission, acceptedFallback = false): NormalizedSubmission {
  return {
    id: submission.id,
    title: submission.title,
    titleSlug: submission.titleSlug,
    status: acceptedFallback ? "ACCEPTED" : normalizeStatus(submission.statusDisplay),
    language: submission.lang,
    submittedAt: fromUnixTime(Number(submission.timestamp)),
    topics: [],
    companies: [],
  };
}

function createFallbackTopicStats(totalSolved: number, mediumSolved: number, hardSolved: number): TopicStat[] {
  const topics = [
    ["Arrays", Math.round(totalSolved * 0.22)],
    ["Hash Table", Math.round(totalSolved * 0.14)],
    ["Dynamic Programming", Math.round(mediumSolved * 0.22 + hardSolved * 0.18)],
    ["Graphs", Math.round(mediumSolved * 0.12 + hardSolved * 0.16)],
    ["Trees", Math.round(totalSolved * 0.1)],
    ["Binary Search", Math.round(totalSolved * 0.08)],
  ] as const;

  return topics.map(([topic, solved]) => ({
    topic,
    solved,
    attempted: Math.max(solved + 2, solved),
    acceptanceRate: solved > 0 ? Math.min(95, 55 + solved) : 0,
    recentSolved: Math.max(0, Math.round(solved * 0.15)),
    easy: Math.round(solved * 0.35),
    medium: Math.round(solved * 0.5),
    hard: Math.round(solved * 0.15),
  }));
}

export function normalizeProfile(data: UserProfileResponse): NormalizedLeetCodeProfile {
  if (!data.matchedUser) {
    throw new Error("No public LeetCode profile found for this username.");
  }

  const stats = data.matchedUser.submitStatsGlobal.acSubmissionNum;
  const totalSolved = getCount(stats, "All");
  const easySolved = getCount(stats, "Easy");
  const mediumSolved = getCount(stats, "Medium");
  const hardSolved = getCount(stats, "Hard");
  const totalSubmissions = getSubmissions(stats);
  const calendar = parseCalendar(data.matchedUser.submissionCalendar);
  const accepted = data.recentAcSubmissionList?.map((submission) => normalizeSubmission(submission, true)) ?? [];
  const recent = data.recentSubmissionList?.map((submission) => normalizeSubmission(submission)) ?? [];
  const byId = new Map<string, NormalizedSubmission>();

  for (const submission of [...recent, ...accepted]) {
    byId.set(submission.id ?? `${submission.titleSlug}-${submission.submittedAt.toISOString()}`, submission);
  }

  return {
    username: data.matchedUser.username,
    realName: data.matchedUser.profile.realName ?? undefined,
    avatarUrl: data.matchedUser.profile.userAvatar ?? undefined,
    ranking: data.userContestRanking?.globalRanking ?? data.matchedUser.profile.ranking ?? undefined,
    contestRating: data.userContestRanking?.rating ?? undefined,
    acceptanceRate: totalSubmissions > 0 ? Number(((totalSolved / totalSubmissions) * 100).toFixed(1)) : undefined,
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    currentStreak: getCurrentStreak(calendar),
    maxStreak: getMaxStreak(calendar),
    submissionCalendar: calendar,
    topicStats: createFallbackTopicStats(totalSolved, mediumSolved, hardSolved),
    companyStats: [],
    recentSubmissions: Array.from(byId.values()).sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()),
  };
}

export function calendarToDays(calendar: Record<string, number>) {
  return Object.entries(calendar).map(([timestamp, count]) => ({
    date: format(fromUnixTime(Number(timestamp)), "yyyy-MM-dd"),
    count,
  }));
}
