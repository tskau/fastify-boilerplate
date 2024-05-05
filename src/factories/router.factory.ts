import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import createEndpointPlugin, { EndpointHandlers } from './endpoint.factory'

export interface RouterMapping {
  [url: string]: EndpointHandlers
}

/**
 * A Fastify plugin that creates a router plugin based on a given mapping of URLs to endpoint handlers.
 *
 * @param baseUrl - The base URL for the router plugin.
 * @param mapping - An object that maps URLs to endpoint handlers.
 *
 * @example
 * ```typescript
 * import createRouterPlugin, { RouterMapping } from '@tskau/fastify-bolierplate'
 *
 * const mapping: RouterMapping = {
 *   '/hello': {
 *     get: (request, reply) => reply.send('hello world!')
 *   }
 * }
 *
 * export default createRouterPlugin('/api', mapping)
 * ```
 *
 * @returns A Fastify plugin function that registers the endpoints from mapping.
 */
export default function createRouterPlugin (
  baseUrl: string,
  mapping: RouterMapping
): FastifyPluginAsync {
  async function pluginImplementation (fastify: FastifyInstance): Promise<void> {
    const endpointPlugins = Object.entries(mapping).map(([url, handlers]) => {
      const endpointUrl = `${baseUrl}${url}`.replace(/\/{2,}/g, '/')
      return createEndpointPlugin(endpointUrl, handlers)
    })

    void Promise.all(
      endpointPlugins.map(
        plugin => fastify.register(plugin)
      )
    )
  }

  return fastifyPlugin(pluginImplementation)
}
