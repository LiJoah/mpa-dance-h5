import CopyPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import { join } from 'path'
import ForkTsCheckerWebpackPlugin from 'react-dev-utils/ForkTsCheckerWebpackPlugin'
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin'
import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin'
import typescriptFormatter from 'react-dev-utils/typescriptFormatter'

import { sync } from 'resolve'
import webpack from 'webpack'
import ManifestPlugin from 'webpack-manifest-plugin'
import envBuilder from '../env'
import { isDev, isProd, isProfilerEnabled } from './constans'
import paths from './paths'

/**
 * NOTE: 在 webpack 的构建流程中，
 * plugin 用于处理更多其他的一些构建任务。
 * 可以这么理解，模块代码转换的工作由 loader 来处理，
 * 除此之外的其他任何工作都可以交由 plugin 来完成
 */
const env = envBuilder()

export const shared: webpack.Plugin[] = [
  // new CleanWebpackPlugin()
]

export const client: webpack.Plugin[] = [
  new HtmlWebpackPlugin(
    Object.assign(
      {},
      {
        filename: path.join(paths.appDist, 'index.html'),
        inject: true,
        template: paths.appHtml
      },
      isProd
        ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true
            }
          }
        : undefined
    )
  ),

  // 和HtmlWebpackPlugin串行使用，允许在index.html中添加变量,
  // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
  new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),

  new ModuleNotFoundPlugin(paths.appPath),
  // new webpack.ProgressPlugin(), // make this optional e.g. via `--progress` flag
  new webpack.DefinePlugin(env.stringified),

  new webpack.DefinePlugin({
    __SERVER__: 'false',
    __BROWSER__: 'true'
  }),

  // 防止在 import 或 require 调用时，生成以下正则表达式匹配的模块
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

  new ManifestPlugin({
    fileName: 'asset-manifest.json',
    publicPath: isDev ? paths.publicPath : paths.clientDist,
    generate: (seed, files, entrypoints) => {
      const manifestFiles = files.reduce((manifest, file) => {
        manifest[file.name] = file.path
        return manifest
      }, seed)
      const entrypointFiles = entrypoints.main.filter((fileName) => !fileName.endsWith('.map'))
      return {
        files: manifestFiles,
        entrypoints: entrypointFiles
      }
    }
  }),

  isProfilerEnabled && new webpack.debug.ProfilingPlugin(),

  // 单独开一个进程开做 ts 的类型检查
  new ForkTsCheckerWebpackPlugin({
    typescript: sync('typescript', {
      basedir: paths.appNodeModules
    }),
    async: isDev,
    useTypescriptIncrementalApi: true,
    checkSyntacticErrors: true,
    // 这里是为了让 typescript 支持 yarn 的 pnp 的查找方式, 但是 typescript
    // 暂时不支持 pnp 的查找方式
    resolveModuleNameModule: (process.versions as any).pnp ? `${__dirname}/pnpTs.ts` : undefined,
    resolveTypeReferenceDirectiveModule: (process.versions as any).pnp
      ? `${__dirname}/pnpTs.ts`
      : undefined,
    tsconfig: paths.appTsConfig,
    // 仅报告这些文件的类型错误
    reportFiles: ['src/**/*.{ts,tsx}'],
    silent: true,
    // The formatter is invoked directly in WebpackDevServerUtils during development
    formatter: isProd ? typescriptFormatter : undefined
  })
].filter(Boolean)

export const server = [
  new webpack.DefinePlugin({
    __SERVER__: 'true',
    __BROWSER__: 'false'
  }),
  new CopyPlugin([
    {
      from: paths.appPublic,
      to: join(paths.appDist, ''),
      ignore: ['index.html']
    }
  ])
]

export default {
  shared,
  client,
  server
}
