import {
  createPluginWithStaticConfig,
  createPluginWithRuntimeConfig,
  createPluginOfCustomFields
} from './factories/plugin.factory'
import createEndpointPlugin, {
  EndpointHandler,
  EndpointHandlers
} from './factories/endpoint.factory'
import createRouterPlugin from './factories/router.factory'

export {
  createPluginWithStaticConfig,
  createPluginWithRuntimeConfig,
  createPluginOfCustomFields,
  createEndpointPlugin,
  createRouterPlugin,
  EndpointHandler,
  EndpointHandlers
}
