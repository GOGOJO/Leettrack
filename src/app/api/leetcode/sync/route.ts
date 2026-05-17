import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { syncLeetCodeProfile } from "@/services/leetcode/sync";

export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.leetcodeProfile.findUnique({ where: { userId: session.user.id } });

  if (!profile) {
    return NextResponse.json({ error: "Connect a LeetCode username first." }, { status: 400 });
  }

  try {
    const synced = await syncLeetCodeProfile(session.user.id, profile.username);
    return NextResponse.json({ ok: true, profileId: synced.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 502 },
    );
  }
}
