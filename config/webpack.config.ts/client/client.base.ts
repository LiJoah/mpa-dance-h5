import path from 'path'

// Yarn 集成了Plug'n'Play(pnp): 即插即用 , 来解决 node_modules 地狱
/**
 * NOTE:
 * 1. 一般情况下, yarn 会生成一个 node_modules 的文件,
 * 然后 node 会按照它的解析规则来解析模块, 但是实际上 node 并不知道这个模块是什么? 它在 node_modules 中查找, 没有的话, 就会在父目录中查找
 * 这样的效率非常的低下,
 * 2: pnp 优化: 但是 yarn 是一个包管理器, 它是知道项目的依赖树的, 那么可以通过 yarn 来告诉 node, 让其直接去加载模块
 * 这样就减少了 node 的查找效率, 同时也减少 node_modules 文件的拷贝
 */
import PnpWebpackPlugin from 'pnp-webpack-plugin'

import webpack from 'webpack'
import { isDev, isProd } from '../constans'
import { client as clientLoaders } from '../loaders'
import paths from '../paths'
import plugins from '../plugins'
import resolvers from '../resolvers'

export default {
  name: 'client',
  target: 'web',

  entry: [
    // 解决模块热更新websocket的一些问题。
    isDev && require.resolve('react-dev-utils/webpackHotDevClient'),
    // 直接将 babel core-js/stable 打包进入到 bundle
    require.resolve('core-js/stable'),
    require.resolve('regenerator-runtime/runtime'),

    paths.srcClient
  ],
  output: {
    // 把入口模块引入的信息以注释的形式输出
    pathinfo: isDev,
    // path: isProd ? paths.clientDist : undefined,
    filename: isProd ? 'client/js/[name].[contenthash:8].js' : 'client/js/bundle.js',
    publicPath: paths.publicPath,
    hotUpdateChunkFilename: !isProd ? '[id].[hash].hot-update.js' : '',
    hotUpdateMainFilename: isProd ? '' : '[hash].hot-update.json',
    // NOTE: 告诉 webpack 在 输出文件到指定位置 时，
    // 使用 未来的版本， 它允许输出以后 释放内存。
    // 如果还存在插件会使用到资源, 那么会出现报错
    // futureEmitAssets: true,
    chunkFilename: isProd ? 'client/js/[name].[chunkhash:8].chunk.js' : 'client/js/[name].chunk.js'
  },
  module: {
    // 使缺少的导出出现错误而不是警告, 默认值为false
    strictExportPresence: true,

    rules: clientLoaders
  },
  resolve: resolvers,

  plugins: [...plugins.shared, ...plugins.client],

  // 这组选项与上面的 resolve 对象的属性集合相同，
  // 但仅用于解析 webpack 的 loader 包。这里定义 loader 的解析规则
  resolveLoader: {
    plugins: [
      // 使用 pnp 的方式加载 loader
      PnpWebpackPlugin.moduleLoader(module)
    ]
  },

  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  stats: {
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    children: false,
    colors: true,
    hash: false,
    modules: false,
    reasons: false,
    timings: true,
    version: false
  }
} as webpack.Configuration
