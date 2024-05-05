import {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyTypeProvider,
  RawServerDefault
} from 'fastify'
import fastifyPlugin from 'fastify-plugin'

type FastifyPlugin =
  | FastifyPluginCallback<FastifyPluginOptions, RawServerDefault, FastifyTypeProvider, FastifyBaseLogger>
  | FastifyPluginAsync<FastifyPluginOptions, RawServerDefault, FastifyTypeProvider, FastifyBaseLogger>
  | Promise<{ default: FastifyPluginAsync<FastifyPluginOptions, RawServerDefault, FastifyTypeProvider, FastifyBaseLogger> }>

/**
 * Creates a new Fastify plugin with static configuration.
 *
 * @template Options - The type of the plugin options. Default is `any`.
 *
 * @param plugin - the plugin to register
 * @param options - the options to pass to the plugin
 *
 * @example
 * ```typescript
 * import { createPluginWithStaticConfig } from '@tskau/fastify-bolierplate'
 * import { myPlugin, MyPluginOptions } from './my-plugin'
 *
 * const PLUGIN_CONFIGURATION = { dbUrl: 'mongodb://localhost:27017' }
 *
 * export default createPluginWithStaticConfig<MyPluginOptions>(myPlugin, PLUGIN_CONFIGURATION)
 * ```
 *
 * @returns a new Fastify plugin that registers the given plugin with the given options
 */
export function createPluginWithStaticConfig<Options = any> (
  plugin: FastifyPlugin,
  options?: Options
): FastifyPlugin {
  async function pluginImplementation (fastify: FastifyInstance): Promise<void> {
    await fastify.register<any>(plugin, options)
  }

  return fastifyPlugin(pluginImplementation)
}

/**
 * Creates a new Fastify plugin with runtime configuration.
 *
 * @template Options - The type of the plugin options. Default is `any`.
 *
 * @param plugin - The Fastify plugin to register.
 * @param optionsGenerator - A function that generates the plugin options based on the Fastify instance.
 *
 * @returns A new Fastify plugin that registers the given plugin with the generated options.
 *
 * @example
 * ```typescript
 * import { FastifyInstance } from 'fastify'
 * import { createPluginWithRuntimeConfig } from './plugin-factory'
 * import { myPlugin, MyPluginOptions } from './my-plugin'
 *
 * function myPluginOptionsGenerator (fastify: FastifyInstance): MyPluginOptions {
 *   const dbConnection = fastify.db.getConnection()
 *   return { dbConnection }
 * }
 *
 * export default createPluginWithRuntimeConfig<MyPluginOptions>(myPlugin, myPluginOptionsGenerator)
 * ```
 */
export function createPluginWithRuntimeConfig<Options = any> (
  plugin: FastifyPlugin,
  optionsGenerator: (fastify: FastifyInstance) => Options
): FastifyPlugin {
  async function pluginImplementation (fastify: FastifyInstance): Promise<void> {
    const generatedOptions = optionsGenerator(fastify)
    await fastify.register<any>(plugin, generatedOptions)
  }

  return fastifyPlugin(pluginImplementation)
}

/**
 * Creates a Fastify plugin that adds custom fields to the Fastify instance.
 *
 * @template Fields - The type of the custom fields. Default is `Object`.
 *
 * @param fieldsGenerator - A function that generates the custom fields based on the Fastify instance.
 * This function can return a Promise if the fields are asynchronously generated.
 *
 * @returns A new Fastify plugin that adds the generated custom fields to the Fastify instance.
 *
 * @example
 * ```typescript
 * import { FastifyInstance } from 'fastify'
 * import { createPluginOfCustomFields } from './plugin-factory'
 *
 * function myCustomFieldsGenerator (fastify: FastifyInstance): Object {
 *   return {
 *     myCustomField: 'Hello, World!',
 *     myAsyncCustomField: async () => {
 *       return await fetch('https://api.example.com/data')
 *        .then(response => response.json())
 *     }
 *   }
 * }
 *
 * export default createPluginOfCustomFields(myCustomFieldsGenerator)
 * ```
 */
export function createPluginOfCustomFields<Fields = Object> (
  fieldsGenerator: (fastify: FastifyInstance) => Fields | Promise<Fields>
): FastifyPlugin {
  async function pluginImplementation (fastify: FastifyInstance): Promise<void> {
    let generatedFields = fieldsGenerator(fastify)

    if (generatedFields instanceof Promise) {
      generatedFields = await generatedFields
    }

    for (const generatedField in generatedFields) {
      // @ts-expect-error
      void fastify.decorate(generatedField, generatedFields[generatedField])
    }
  }

  return fastifyPlugin(pluginImplementation)
}
