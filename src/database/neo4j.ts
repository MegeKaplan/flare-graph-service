import neo4j from 'neo4j-driver';
import { env } from '../config/env.js';

export const driver = neo4j.driver(
  env.NEO4J_URL,
  neo4j.auth.basic(env.NEO4J_USER, env.NEO4J_PASSWORD)
)

export const getSession = () => {
  return driver.session()
}