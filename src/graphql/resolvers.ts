export const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  },
  Mutation: {
    followUser: (_: any, { userId }: { userId: string }) => {
      return `User followed: ${userId}`
    }
  }
}