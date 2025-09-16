

export const queryKeys = {
  ask: {
    all: ['ask'] as const,
    detail: (id: string) => [...queryKeys.ask.all, id] as const,
  },
  book: {
    all: ['book'] as const,
    detail: (id: string) => [...queryKeys.book.all, id] as const,
  },
  bookmark: {
    all: ['bookmark'] as const,
    detail: (id: string) => [...queryKeys.bookmark.all, id] as const,
    byUser: (userId: string) => [...queryKeys.bookmark.all, userId] as const,
  },
  comment: {
    all: ['comment'] as const,
    detail: (id: string) => [...queryKeys.comment.all, id] as const,
  },
}