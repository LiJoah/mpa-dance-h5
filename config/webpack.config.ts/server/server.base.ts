import path from 'path'
// NOTE: 防止将某些 import 的包(package)打包到 bundle 中，
// 而是在运行时(runtime)再去从外部获取这些扩展依赖
import nodeExternals from 'webpack-node-externals'
import { server as serverLoaders } from '../loaders'
import paths from '../paths'
import plugins from '../plugins'
import resolvers from '../resolvers'

export default {
  name: 'server',
  target: 'node',
  entry: {
    // server: [path.resolve(paths.srcServer, 'index.js')],
    server: [
      require.resolve('core-js/stable'),
      require.resolve('regenerator-runtime/runtime'),
      path.resolve(paths.srcServer, 'index.ts')
    ]
  },
  externals: [
    nodeExternals({
      // we still want imported css from external files to be bundled otherwise 3rd party packages
      // which require us to include their own css would not work properly
      whitelist: /\.css$/
    })
  ],
  output: {
    path: paths.serverDist,
    filename: 'server.js',
    publicPath: paths.publicPath
    // libraryTarget: 'commonjs2',
  },
  resolve: { ...resolvers },
  module: {
    rules: serverLoaders
  },
  plugins: [...plugins.shared, ...plugins.server],
  stats: {
    assets: false,
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    children: false,
    colors: true,
    hash: false,
    modules: false,
    performance: false,
    reasons: false,
    timings: true,
    version: false
  },
  node: {
    __dirname: false
  }
}
