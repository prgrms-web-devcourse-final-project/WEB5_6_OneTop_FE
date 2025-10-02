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
};
