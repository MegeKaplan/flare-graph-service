import { withSession } from '../../database/neo4j.js'

export const userResolvers = {
  // User type resolvers
  User: {
    // Fetch follows of a user
    follows: async (parent: { id: string }) => {
      return withSession(async (session) => {
        const result = await session.run(
          `
          MATCH (u:User {id: $id})-[:FOLLOWS]->(f:User)
          RETURN f { .id } AS user
          `,
          { id: parent.id }
        )
        return result.records.map((r: any) => r.get('user'))
      })
    },

    // Fetch followers of a user
    followers: async (parent: { id: string }) => {
      return withSession(async (session) => {
        const result = await session.run(
          `
          MATCH (f:User)-[:FOLLOWS]->(u:User {id: $id})
          RETURN f { .id } AS user
          `,
          { id: parent.id }
        )
        return result.records.map((r: any) => r.get('user'))
      })
    }
  },

  // Query resolvers
  Query: {
    // Fetch all users
    users: async () => {
      return withSession(async (session) => {
        const result = await session.run(
          `MATCH (u:User) RETURN u { .id } AS user`
        )
        return result.records.length > 0 ? result.records.map((record: any) => record.get('user')) : []
      })
    },

    // Fetch user by ID
    user: async (_: any, { id }: { id: string }) => {
      return withSession(async (session) => {
        const result = await session.run(
          `MATCH (u:User {id: $id}) RETURN u { .id } AS user`,
          { id }
        )
        return result.records.length > 0 ? result.records[0].get('user') : null
      })
    }
  },

  // Mutation resolvers
  Mutation: {
    // Follow a user
    followUser: async (_: any, { followerId, followeeId }: { followerId: string, followeeId: string }, { principalUserId }: { principalUserId: string }) => {
      if (!principalUserId) {
        throw new Error('Unauthorized: You must be logged in to follow a user.')
      }

      if (principalUserId !== followerId) {
        throw new Error('Unauthorized: You can only follow users as yourself.')
      }

      if (followerId === followeeId) {
        throw new Error('You cannot follow yourself.')
      }

      return withSession(async (session) => {
        await session.run(
          `
          MERGE (follower:User {id: $followerId})
          MERGE (followee:User {id: $followeeId})
          MERGE (follower)-[r:FOLLOWS]->(followee)
          SET r.followedAt = datetime(), r.status = "pending"
          `,
          { followerId, followeeId }
        )
        return true
      })
    }
  }
}