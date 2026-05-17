import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { leetcodeGraphQL } from "@/services/leetcode/client";
import { USER_PROFILE_QUERY } from "@/services/leetcode/queries";
import { normalizeProfile, type UserProfileResponse } from "@/services/leetcode/normalize";

const SYNC_FRESHNESS_MS = 1000 * 60 * 30;

export async function syncLeetCodeProfile(userId: string, username: string) {
  const trimmedUsername = username.trim();

  if (!trimmedUsername) {
    throw new Error("LeetCode username is required.");
  }

  const existing = await prisma.leetcodeProfile.findUnique({ where: { userId } });
  if (existing?.lastSyncedAt && Date.now() - existing.lastSyncedAt.getTime() < SYNC_FRESHNESS_MS) {
    return existing;
  }

  try {
    const data = await leetcodeGraphQL<UserProfileResponse>(USER_PROFILE_QUERY, { username: trimmedUsername });
    const profile = normalizeProfile(data);

    const savedProfile = await prisma.leetcodeProfile.upsert({
      where: { userId },
      create: {
        userId,
        username: profile.username,
        realName: profile.realName,
        avatarUrl: profile.avatarUrl,
        ranking: profile.ranking,
        contestRating: profile.contestRating,
        acceptanceRate: profile.acceptanceRate,
        totalSolved: profile.totalSolved,
        easySolved: profile.easySolved,
        mediumSolved: profile.mediumSolved,
        hardSolved: profile.hardSolved,
        currentStreak: profile.currentStreak,
        maxStreak: profile.maxStreak,
        submissionCalendar: profile.submissionCalendar as Prisma.InputJsonValue,
        topicStats: profile.topicStats as Prisma.InputJsonValue,
        companyStats: profile.companyStats as Prisma.InputJsonValue,
        lastSyncedAt: new Date(),
        syncError: null,
      },
      update: {
        username: profile.username,
        realName: profile.realName,
        avatarUrl: profile.avatarUrl,
        ranking: profile.ranking,
        contestRating: profile.contestRating,
        acceptanceRate: profile.acceptanceRate,
        totalSolved: profile.totalSolved,
        easySolved: profile.easySolved,
        mediumSolved: profile.mediumSolved,
        hardSolved: profile.hardSolved,
        currentStreak: profile.currentStreak,
        maxStreak: profile.maxStreak,
        submissionCalendar: profile.submissionCalendar as Prisma.InputJsonValue,
        topicStats: profile.topicStats as Prisma.InputJsonValue,
        companyStats: profile.companyStats as Prisma.InputJsonValue,
        lastSyncedAt: new Date(),
        syncError: null,
      },
    });

    await prisma.statsSnapshot.create({
      data: {
        leetcodeProfileId: savedProfile.id,
        totalSolved: profile.totalSolved,
        easySolved: profile.easySolved,
        mediumSolved: profile.mediumSolved,
        hardSolved: profile.hardSolved,
        acceptanceRate: profile.acceptanceRate,
        contestRating: profile.contestRating,
        ranking: profile.ranking,
        currentStreak: profile.currentStreak,
        topicStats: profile.topicStats as Prisma.InputJsonValue,
        companyStats: profile.companyStats as Prisma.InputJsonValue,
        raw: profile as unknown as Prisma.InputJsonValue,
      },
    });

    for (const submission of profile.recentSubmissions) {
      await prisma.submission.upsert({
        where: {
          leetcodeSubmissionId: submission.id ?? `${savedProfile.id}-${submission.titleSlug}-${submission.submittedAt.getTime()}`,
        },
        create: {
          leetcodeProfileId: savedProfile.id,
          leetcodeSubmissionId: submission.id ?? `${savedProfile.id}-${submission.titleSlug}-${submission.submittedAt.getTime()}`,
          title: submission.title,
          titleSlug: submission.titleSlug,
          status: submission.status,
          language: submission.language,
          submittedAt: submission.submittedAt,
          runtime: submission.runtime,
          memory: submission.memory,
          topics: submission.topics,
          companies: submission.companies,
        },
        update: {
          status: submission.status,
          language: submission.language,
          submittedAt: submission.submittedAt,
        },
      });
    }

    return savedProfile;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sync LeetCode data.";
    await prisma.leetcodeProfile.upsert({
      where: { userId },
      create: {
        userId,
        username: trimmedUsername,
        syncError: message,
      },
      update: {
        username: trimmedUsername,
        syncError: message,
      },
    });
    throw error;
  }
}
