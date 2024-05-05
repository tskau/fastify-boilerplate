# @tskau/fastify-boilerplate

various boilerplate stuff to build fastify apps faster.
unsurprisingly, primarily used in tskau's codebase.

### installation

```bash
npm i @tskau/fastify-boilerplate
# yarn install @tskau/fastify-boilerplate
# pnpm add @tskau/fastify-boilerplate
```

### avaliable functionality

- `createPluginWithStaticConfig<Options>(plugin, options)` - creates the plugin that registers the given plugin with the given options.
- `createPluginWithRuntimeConfig<Options>(plugin, optionsGenerator)` - creates the plugin that registers the given plugin with the generated options.
- `createPluginOfCustomFields<Fields>(plugin, fields)` - creates the plugin that adds the generated custom fields to the fastify instance.
- `createEndpointPlugin(url, handlers)` - creates the plugin that registers the endpoint using the simple method mapping
- `createRouterPlugin(baseUrl, routes)` - creates the plugin that registers the router using the simple endpoint mapping
