import { contentResolvers } from './content.resolver.js'
import { userResolvers } from './user.resolver.js'

export const resolvers = {
  User: userResolvers.User,
  Content: contentResolvers.Content,

  Query: {
    ...userResolvers.Query,
    ...contentResolvers.Query
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...contentResolvers.Mutation
  }
}