import neo4j from 'neo4j-driver';
import { env } from '../config/env.js';
import { Neo4jGraphQL } from '@neo4j/graphql'

// Create a Neo4j driver instance
export const driver = neo4j.driver(
  env.NEO4J_URL,
  neo4j.auth.basic(env.NEO4J_USER, env.NEO4J_PASSWORD)
)

// Function to get a Neo4j session
export const getSession = () => {
  return driver.session()
}

// Function to execute a work function with a Neo4j session
export async function withSession<T>(work: (session: any) => Promise<T>): Promise<T> {
  const session = getSession();
  try {
    return await work(session)
  } finally {
    await session.close()
  }
}

// Function to create a Neo4j schema from type definitions
export async function createNeo4jSchema(typeDefs: string): Promise<any> {
  const neoSchema = new Neo4jGraphQL({ typeDefs, driver })
  return await neoSchema.getSchema()
}