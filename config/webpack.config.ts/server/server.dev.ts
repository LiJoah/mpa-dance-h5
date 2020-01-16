// import webpack from 'webpack'
import WriteFileWebpackPlugin from 'write-file-webpack-plugin'
import baseConfig from './server.base'

const config = {
  ...baseConfig,
  plugins: [
    // NOTE: webpack dev server 的打包出来的是在内存中的, 如果需要写入硬盘,那么就需要使用这个插件
    new WriteFileWebpackPlugin(),
    ...baseConfig.plugins,
    // new webpack.HotModuleReplacementPlugin()
  ],
  mode: 'development',
  performance: {
    hints: false
  }
}

export default config
