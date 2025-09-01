// Import the framework and instantiate it
import Fastify from 'fastify'
import { ApolloServer } from '@apollo/server'
import fastifyApollo from '@as-integrations/fastify'
import { typeDefs, resolvers } from './graphql/index.js'
import { env } from './config/env.js'
import { createContext } from './graphql/context.js'

// Function to start the server
async function startServer() {
  // Create a Fastify and Apollo server instance
  const app = Fastify({ logger: true })
  const apollo = new ApolloServer({ typeDefs, resolvers })

  // Start the Apollo server
  await apollo.start()

  // Register the Apollo server with Fastify
  app.register(fastifyApollo(apollo), {
    path: '/graphql',
    // @ts-ignore: context is not supported by the integration
    context: async (request) => createContext(request)
  })

  // try to listen the port
  try {
    await app.listen({
      port: Number(env.PORT),
      host: "0.0.0.0"
    })
    console.log(`Server running at http://localhost:${env.PORT}/graphql`)
  } catch (err) {
    app.log.error(err)
  }
}

// Start the server
startServer()

// Neo4j connection test
import { getSession } from './database/neo4j.js';

async function testNeo4j() {
  const session = getSession()
  try {
    const result = await session.run('RETURN "Neo4j connection successful" AS message')
    console.log(result.records[0]?.get('message'))
  } finally {
    await session.close()
  }
}

testNeo4j().catch(err => {
  console.error('Error connecting to Neo4j:', err)
})