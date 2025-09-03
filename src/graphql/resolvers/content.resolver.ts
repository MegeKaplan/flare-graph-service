import { withSession } from '../../database/neo4j.js'

export const contentResolvers = {
  // Content type resolvers
  Content: {
    // Fetch likes of a content
    likes: async (parent: { id: string }) => {
      return withSession(async (session) => {
        const result = await session.run(
          `
          MATCH (u:User)-[:LIKED]->(c:Content {id: $id})
          RETURN u { .id } AS user
          `,
          { id: parent.id }
        )
        return result.records.map((r: any) => r.get('user'))
      })
    }
  },

  // Query resolvers
  Query: {
    // Fetch all contents
    contents: async () => {
      return withSession(async (session) => {
        const result = await session.run(
          `MATCH (c:Content) RETURN c { .id, .type, .createdAt, .expiresAt } AS content`
        )
        return result.records.length > 0 ? result.records.map((record: any) => record.get('content')) : []
      })
    },

    // Fetch content by ID
    content: async (_: any, { id }: { id: string }) => {
      return withSession(async (session) => {
        const result = await session.run(
          `MATCH (c:Content {id: $id}) RETURN c { .id, .type, .createdAt, .expiresAt } AS content`,
          { id }
        )
        return result.records.length > 0 ? result.records[0].get('content') : null
      })
    }
  },

  // Mutation resolvers
  Mutation: {
    // Create a content
    createContent: async (_: any, { userId, contentId, type, expiresAt }: { userId: string, contentId: string, type: string, expiresAt?: string }) => {
      if (!userId) throw new Error('Unauthorized: You must be logged in to create content.')

      if (!type) type = "post"

      return withSession(async (session) => {
        const result = await session.run(
          `
          MERGE (c:Content {id: $contentId})
          ON CREATE SET c.type = $type, c.createdAt = datetime(), c.expiresAt = $expiresAt
          MERGE (u:User {id: $userId})
          MERGE (u)-[:CREATED]->(c)
          RETURN c { .id, .type, createdAt: toString(c.createdAt), expiresAt: toString(c.expiresAt) } AS content
          `,
          { userId, contentId, type, expiresAt: expiresAt || null }
        )
        return result.records[0].get('content')
      })
    },

    // Like a content
    likeContent: async (_: any, { userId, contentId }: { userId: string, contentId: string }, { principalUserId }: { principalUserId: string }) => {
      if (!principalUserId) throw new Error('Unauthorized: You must be logged in to like a content.')

      if (principalUserId !== userId) throw new Error('You can only like contents as yourself')

      return withSession(async (session) => {
        await session.run(
          `
          MERGE (u:User {id: $userId})
          MERGE (c:Content {id: $contentId})
          MERGE (u)-[r:LIKED]->(c)
          ON CREATE SET r.likedAt = datetime()
          `,
          { userId, contentId }
        )
        return true
      })
    },

    // Unlike a content
    unlikeContent: async (_: any, { userId, contentId }: { userId: string, contentId: string }, { principalUserId }: { principalUserId: string }) => {
      if (!principalUserId) throw new Error('Unauthorized: You must be logged in to unlike a content.')

      if (principalUserId !== userId) throw new Error('You can only unlike contents as yourself')

      return withSession(async (session) => {
        await session.run(
          `
          MATCH (u:User {id: $userId})-[r:LIKED]->(c:Content {id: $contentId})
          DELETE r
          `,
          { userId, contentId }
        )
        return true
      })
    }
  }
}
