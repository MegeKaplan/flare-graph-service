export const contentTypeDefs = `
type Content {
  id: ID!
  likes: [User!]
}

type Query {
  contents: [Content!]
  content(id: ID!): Content
}

type Mutation {
  likeContent(userId: ID!, contentId: ID!): Boolean!
  unlikeContent(userId: ID!, contentId: ID!): Boolean!
}
`