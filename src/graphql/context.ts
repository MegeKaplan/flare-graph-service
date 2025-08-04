import { FastifyRequest } from 'fastify';

export interface Context {
  principalUserId: string | null;
}

export async function createContext(request: FastifyRequest): Promise<Context> {
  const principalUserId = (request.headers['x-user-id'] as string | undefined) || null;
  return { principalUserId };
}