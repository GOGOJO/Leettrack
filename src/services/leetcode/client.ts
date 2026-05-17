const LEETCODE_GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export class LeetCodeApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LeetCodeApiError";
  }
}

export async function leetcodeGraphQL<T>(query: string, variables: Record<string, unknown>) {
  const response = await fetch(LEETCODE_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      referer: "https://leetcode.com",
      "user-agent": "LeetTrack/0.1",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 * 10 },
  });

  if (!response.ok) {
    throw new LeetCodeApiError(`LeetCode request failed with ${response.status}`);
  }

  const payload = (await response.json()) as GraphQLResponse<T>;

  if (payload.errors?.length) {
    throw new LeetCodeApiError(payload.errors.map((error) => error.message).join(", "));
  }

  if (!payload.data) {
    throw new LeetCodeApiError("LeetCode returned an empty response.");
  }

  return payload.data;
}
