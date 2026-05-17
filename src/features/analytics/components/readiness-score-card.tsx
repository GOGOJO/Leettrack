import { Brain } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculateReadinessScore } from "@/services/analytics/readiness-score";
import { getPracticeRecommendation } from "@/services/analytics/recommendations";
import type { TopicStat } from "@/types/leetcode";

export function ReadinessScoreCard({ topicStats }: { topicStats: TopicStat[] }) {
  const score = calculateReadinessScore(topicStats);
  const recommendation = getPracticeRecommendation(score);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Interview Readiness Score</CardTitle>
            <CardDescription>{recommendation}</CardDescription>
          </div>
          <Brain className="size-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="mb-2 flex items-end justify-between">
            <span className="text-4xl font-semibold">{score.overall}/100</span>
            <span className="text-sm text-muted-foreground">Overall readiness</span>
          </div>
          <Progress value={score.overall} />
        </div>
        <div className="grid gap-2">
          {score.topics.slice(0, 5).map((topic) => (
            <div key={topic.topic} className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-sm">
              <span>{topic.topic}</span>
              <span className="font-medium">{topic.score}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
