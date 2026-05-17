import type { TopicStat } from "@/types/leetcode";

export type TopicReadinessScore = {
  topic: string;
  score: number;
  solved: number;
  acceptanceRate: number;
};

export type ReadinessScore = {
  overall: number;
  topics: TopicReadinessScore[];
  strongestTopic?: TopicReadinessScore;
  weakestTopic?: TopicReadinessScore;
};

const CORE_TOPICS = [
  "Arrays",
  "Strings",
  "Hash Table",
  "Two Pointers",
  "Binary Search",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Heap",
  "Backtracking",
  "Greedy",
];

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreTopic(stat: TopicStat) {
  const volumeScore = Math.min(40, stat.solved * 2.5);
  const acceptanceScore = Math.min(25, (stat.acceptanceRate / 100) * 25);
  const recencyScore = Math.min(20, stat.recentSolved * 4);
  const difficultyScore = Math.min(15, stat.medium * 1.5 + stat.hard * 2.5);

  return clamp(volumeScore + acceptanceScore + recencyScore + difficultyScore);
}

export function calculateReadinessScore(topicStats: TopicStat[]): ReadinessScore {
  const statMap = new Map(topicStats.map((stat) => [stat.topic, stat]));
  const topics = CORE_TOPICS.map((topic) => {
    const stat = statMap.get(topic) ?? {
      topic,
      solved: 0,
      attempted: 0,
      acceptanceRate: 0,
      recentSolved: 0,
      easy: 0,
      medium: 0,
      hard: 0,
    };

    return {
      topic,
      score: scoreTopic(stat),
      solved: stat.solved,
      acceptanceRate: stat.acceptanceRate,
    };
  }).sort((a, b) => b.score - a.score);

  const overall = clamp(topics.reduce((sum, topic) => sum + topic.score, 0) / topics.length);

  return {
    overall,
    topics,
    strongestTopic: topics[0],
    weakestTopic: topics.at(-1),
  };
}
