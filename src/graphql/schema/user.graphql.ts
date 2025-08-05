export const userTypeDefs = `
type User {
  id: ID!
  follows: [User!]
  followers: [User!]
}

type Query {
  users: [User!]
  user(id: ID!): User
}

type Mutation {
  followUser(followerId: ID!, followeeId: ID!): Boolean!
  unfollowUser(followerId: ID!, followeeId: ID!): Boolean!
}
`