export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type TopicStat = {
  topic: string;
  solved: number;
  attempted: number;
  acceptanceRate: number;
  recentSolved: number;
  easy: number;
  medium: number;
  hard: number;
};

export type CompanyStat = {
  company: string;
  solved: number;
  attempted: number;
};

export type CalendarDay = {
  date: string;
  count: number;
};

export type NormalizedSubmission = {
  id?: string;
  title: string;
  titleSlug: string;
  status: "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "RUNTIME_ERROR" | "COMPILE_ERROR" | "MEMORY_LIMIT_EXCEEDED" | "OTHER";
  language?: string;
  submittedAt: Date;
  runtime?: string;
  memory?: string;
  topics: string[];
  companies: string[];
};

export type NormalizedLeetCodeProfile = {
  username: string;
  realName?: string;
  avatarUrl?: string;
  ranking?: number;
  contestRating?: number;
  acceptanceRate?: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  currentStreak: number;
  maxStreak: number;
  submissionCalendar: Record<string, number>;
  topicStats: TopicStat[];
  companyStats: CompanyStat[];
  recentSubmissions: NormalizedSubmission[];
};
