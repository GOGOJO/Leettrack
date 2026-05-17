"use client";

import { useActionState } from "react";
import { RefreshCw } from "lucide-react";

import { connectLeetCodeAction } from "@/actions/leetcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState = { ok: false, message: "" };

export function ConnectLeetCodeForm({ connected, username }: { connected: boolean; username?: string }) {
  const [state, action, pending] = useActionState(connectLeetCodeAction, initialState);

  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>{connected ? "Sync LeetCode" : "Connect LeetCode"}</CardTitle>
        <CardDescription>
          {connected ? `Connected as ${username}. Refresh your latest stats anytime.` : "Enter your public LeetCode username to populate the dashboard."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-3 sm:flex-row">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" defaultValue={username} placeholder="leetcode_username" />
          </div>
          <Button className="mt-auto" disabled={pending} type="submit">
            <RefreshCw className={pending ? "size-4 animate-spin" : "size-4"} />
            {pending ? "Syncing" : "Sync now"}
          </Button>
        </form>
        {state.message ? <p className={state.ok ? "mt-3 text-sm text-emerald-500" : "mt-3 text-sm text-destructive"}>{state.message}</p> : null}
      </CardContent>
    </Card>
  );
}
