// Import the framework and instantiate it
import Fastify from 'fastify'
import { ApolloServer } from '@apollo/server'
import fastifyApollo from '@as-integrations/fastify'
import { typeDefs, resolvers } from './graphql/index.js'

// Function to start the server
async function startServer() {
  // Create a Fastify and Apollo server instance
  const app = Fastify({ logger: true })
  const apollo = new ApolloServer({ typeDefs, resolvers })

  // Register the Apollo server with Fastify
  await apollo.start()
  app.register(fastifyApollo(apollo), { path: '/graphql' })

  // try to listen the port
  try {
    await app.listen({ port: 3000 })
    console.log('Server running at http://localhost:3000/graphql')
  } catch (err) {
    app.log.error(err)
  }
}

// Start the server
startServer()