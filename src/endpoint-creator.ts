import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  HTTPMethods
} from 'fastify'
import fastifyPlugin from 'fastify-plugin'

type EndpointHandlerFunction<ReplyData = void> = (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<ReplyData> | ReplyData

type EndpointHandler<ReplyData = void> =
  EndpointHandlerFunction<ReplyData> |
  { schema: FastifySchema, handler: EndpointHandlerFunction<ReplyData> }

export type EndpointHandlers = {
  [key in HTTPMethods]: EndpointHandler
}

/**
 * A Fastify plugin to create a set of endpoints with the same URL but different HTTP methods.
 *
 * @param url - The URL for the endpoints.
 * @param handlers - An object containing the handlers for each HTTP method.
 *
 * @example
 * ```typescript
 * import {
 *   createEndpointPlugin,
 *   EndpointHandlers
 * } from '@tskau/fastify-bolierplate'
 * import S from 'fluent-json-schema'
 *
 * const handlers: EndpointHandlers = {
 *   get: (request, reply) => reply.send('hello world!'),
 *   post: {
 *     schema: {
 *       body: S.object()
 *         .prop('name', S.string().default('world'))
 *     },
 *     handler: (request, reply) => reply.send(`hello ${request.body.name}!`)
 *   }
 * }
 *
 * export default createEndpointPlugin('/hello', handlers)
 * ```
 *
 * @returns A Fastify plugin function.
 */
export default function createEndpointPlugin (
  url: string,
  handlers: EndpointHandlers
): FastifyPluginAsync {
  async function pluginImplementation (fastify: FastifyInstance): Promise<void> {
    Object.entries(handlers).forEach(([method, handler]) => {
      if (typeof handler === 'function') {
        fastify.route({ url, method: method as HTTPMethods, handler })
      } else {
        fastify.route({ url, method: method as HTTPMethods, ...handler })
      }
    })
  }

  return fastifyPlugin(pluginImplementation)
}
