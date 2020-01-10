import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import InlineChunkHtmlPlugin from 'react-dev-utils/InlineChunkHtmlPlugin'
import WorkboxWebpackPlugin from 'workbox-webpack-plugin'
import { optimization } from '../optimization'
import paths from '../paths'
import baseConfig from './client.base'
const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true

const config = {
  ...baseConfig,
  mode: 'production',
  devtool: generateSourceMap ? 'source-map' : false,

  // bail 一旦打包有错，立即停止
  bail: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'dist/client/css/[name].[contenthash:8].css',
      chunkFilename: 'dist/client/css/[id].[contenthash:8].chunk.css'
    }),

    // webpack运行时代码(我理解的就是webpack的一些公用代码)放在html中，而不是浪费一个请求去加载js文件。
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),

    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      exclude: [/\.map$/, /asset-manifest\.json$/],
      importWorkboxFrom: 'cdn',
      navigateFallback: paths.clientDist + '/index.html',
      navigateFallbackBlacklist: [
        // Exclude URLs starting with /_, as they're likely an API call
        new RegExp('^/_'),
        // Exclude any URLs whose last part seems to be a file extension
        // as they're likely a resource and not a SPA route.
        // URLs containing a "?" character won't be blacklisted as they're likely
        // a route with query params (e.g. auth callbacks).
        new RegExp('/[^/?]+\\.[^/]+$')
      ]
    })
  ],
  optimization,
  ...baseConfig.plugins
}

export default config
