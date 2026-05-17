import { describe, expect, it } from "vitest";

import { calculateReadinessScore, scoreTopic } from "./readiness-score";

const baseTopic = {
  attempted: 10,
  easy: 3,
  medium: 4,
  hard: 1,
};

describe("readiness scoring", () => {
  it("scores stronger topics above weaker topics", () => {
    const arrays = scoreTopic({ ...baseTopic, topic: "Arrays", solved: 25, acceptanceRate: 88, recentSolved: 5 });
    const dp = scoreTopic({ ...baseTopic, topic: "Dynamic Programming", solved: 2, acceptanceRate: 45, recentSolved: 0 });

    expect(arrays).toBeGreaterThan(dp);
    expect(arrays).toBeLessThanOrEqual(100);
  });

  it("returns strongest, weakest, and overall score", () => {
    const score = calculateReadinessScore([
      { ...baseTopic, topic: "Arrays", solved: 25, acceptanceRate: 88, recentSolved: 5 },
      { ...baseTopic, topic: "Graphs", solved: 10, acceptanceRate: 65, recentSolved: 2 },
      { ...baseTopic, topic: "Dynamic Programming", solved: 2, acceptanceRate: 45, recentSolved: 0 },
    ]);

    expect(score.overall).toBeGreaterThanOrEqual(0);
    expect(score.overall).toBeLessThanOrEqual(100);
    expect(score.strongestTopic?.topic).toBe("Arrays");
    expect(score.weakestTopic).toBeDefined();
  });
});
