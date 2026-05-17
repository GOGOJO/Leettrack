"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { syncLeetCodeProfile } from "@/services/leetcode/sync";

export type ConnectLeetCodeState = {
  ok: boolean;
  message: string;
};

export async function connectLeetCodeAction(_state: ConnectLeetCodeState, formData: FormData): Promise<ConnectLeetCodeState> {
  const session = await auth();
  const username = String(formData.get("username") ?? "").trim();

  if (!session?.user?.id) {
    return { ok: false, message: "You need to sign in first." };
  }

  if (!username) {
    return { ok: false, message: "Enter your LeetCode username." };
  }

  try {
    await syncLeetCodeProfile(session.user.id, username);
    revalidatePath("/dashboard");
    return { ok: true, message: "LeetCode profile synced." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "LeetCode sync failed.",
    };
  }
}
