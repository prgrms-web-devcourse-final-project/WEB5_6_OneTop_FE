export const queryKeys = {
  auth: {
    all: () => ["auth"],
    me: () => ["auth", "me"],
  },
  profile: {
    all: () => ["profile"],
    get: () => ["profile", "get"],
    set: () => ["profile", "set"],
  },
  post: {
    all: () => ["post"],
    id: (id: string) => ["post", id],
    like: () => ["post", "like"],
  },
  scenarios: {
    list: () => ["scenarios", "list"] as const,
    detail: (id: number | null) => ["scenarios", "detail", id] as const,
    status: (id: number | null) => ["scenarios", "status", id] as const,
  },
  comment: {
    like: (id: string) => ["comment", "like", id],
    set: (id: string) => ["comment", "set", id],
    get: (id: string) => ["comment", "get", id],
  },
  usageStats: {
    all: () => ["usageStats"] as const,
  },
  representativeProfile: {
    all: () => ["representativeProfile"] as const,
    get: () => ["representativeProfile", "get"] as const,
  },
  myInfo: {
    all: () => ["myInfo"] as const,
    get: () => ["myInfo", "get"] as const,
  },
  myScenarios: {
    all: () => ["myScenarios"] as const,
    list: (page: number) => ["myScenarios", "list", page] as const,
  },
  myPosts: {
    all: () => ["myPosts"] as const,
    list: (page: number) => ["myPosts", "list", page] as const,
  },
  myComments: {
    all: () => ["myComments"] as const,
    list: (page: number) => ["myComments", "list", page] as const,
  },
};
