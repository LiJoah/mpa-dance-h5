import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin'
import webpack from 'webpack'
import WriteFileWebpackPlugin from 'write-file-webpack-plugin'
import paths from '../paths'
import baseConfig from './client.base'
const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true

const config: webpack.Configuration = {
  ...baseConfig,
  // cheap-module-source-map 一种简单的 source-map 不适合在生产环境
  devtool: generateSourceMap ? 'cheap-module-source-map' : false,
  plugins: [
    // NOTE: webpack dev server 的打包出来的是在内存中的, 如果需要写入硬盘,那么就需要使用这个插件
    new WriteFileWebpackPlugin(),
    // 当开启 HMR(模块热替换) 的时候使用该插件会显示模块的相对路径，建议用于开发环境
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // 如果路径有误则直接报错, 同时解决 mac, linux, window 上的路径引用的问题
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    ...baseConfig.plugins
  ],
  mode: 'development',
  performance: {
    hints: false
  }
}

export default config
