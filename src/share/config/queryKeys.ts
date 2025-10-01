

export const queryKeys = {
  auth: {
    all: () => ['auth'],
    me: () => ['auth', 'me'],
  },
  profile: {
    all: () => ['profile'],
    get: () => ['profile', 'get'],
    set: () => ['profile', 'set'],
  },
  post: {
    all: () => ['post'],
    id: (id: string) => ['post', id],
    like: () => ['post', 'like'],
  }
}