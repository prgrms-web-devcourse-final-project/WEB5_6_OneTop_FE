export const queryKeys = {
  auth: {
    all: () => ["auth"],
    me: () => ["auth", "me"],
  },
  // 추가
  scenarios: {
    list: () => ["scenarios", "list"] as const,
    detail: (id: number | null) => ["scenarios", "detail", id] as const,
    status: (id: number | null) => ["scenarios", "status", id] as const,
  },
};
