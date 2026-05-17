import type { ReadinessScore } from "@/services/analytics/readiness-score";

export function getPracticeRecommendation(score: ReadinessScore) {
  const weakTopic = score.weakestTopic;

  if (!weakTopic) {
    return "Connect LeetCode to generate a practice recommendation.";
  }

  if (weakTopic.score < 35) {
    return `Practice ${weakTopic.topic} fundamentals with easy and medium problems.`;
  }

  if (weakTopic.score < 65) {
    return `Practice ${weakTopic.topic} under timed conditions.`;
  }

  return `Keep ${weakTopic.topic} fresh while increasing hard problem coverage.`;
}
