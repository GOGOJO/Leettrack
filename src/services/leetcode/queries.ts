export const USER_PROFILE_QUERY = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        userAvatar
        ranking
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      submissionCalendar
    }
    userContestRanking(username: $username) {
      rating
      globalRanking
    }
    recentAcSubmissionList(username: $username, limit: 20) {
      id
      title
      titleSlug
      timestamp
    }
    recentSubmissionList(username: $username, limit: 20) {
      id
      title
      titleSlug
      statusDisplay
      lang
      timestamp
    }
  }
`;

export const PROBLEM_TAGS_QUERY = `
  query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
      questions {
        titleSlug
        difficulty
        topicTags {
          name
        }
      }
    }
  }
`;
