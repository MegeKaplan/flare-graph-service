export const contentTypeDefs = `
type Content {
  id: ID!
  likes: [User!]
  type: String
  createdAt: String!
  expiresAt: String
}

type Query {
  contents: [Content!]
  content(id: ID!): Content
}

type Mutation {
  createContent(userId: ID!, contentId: ID!, type: String!, expiresAt: String): Content!
  likeContent(userId: ID!, contentId: ID!): Boolean!
  unlikeContent(userId: ID!, contentId: ID!): Boolean!
}
`