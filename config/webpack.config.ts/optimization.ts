import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import safePostCssParser from 'postcss-safe-parser'
import TerserPlugin from 'terser-webpack-plugin'
import webpack from 'webpack'
import { generateSourceMap, isProfilerEnabled } from './constans'

export const optimization: webpack.Options.Optimization = {
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        parse: {
          ecma: 8
        },
        compress: {
          ecma: 5,
          warnings: false,
          // 由于Uglify违反了看似有效的代码的问题而被禁用
          comparisons: false,
          inline: 2
        },
        mangle: {
          safari10: true
        },
        // Added for profiling in devtools
        keep_classnames: isProfilerEnabled,
        keep_fnames: isProfilerEnabled,
        output: {
          ecma: 5,
          comments: false,
          ascii_only: true
        }
      },
      parallel: true,
      cache: true,
      sourceMap: generateSourceMap
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: {
        parser: safePostCssParser,
        map: {
          // `inline: false` : 强制将源映射输出到单独的文件中
          inline: false,
          // `annotation: true` 帮助浏览器更好的处理, 注释
          annotation: true
        }
      }
    })
  ],
  namedModules: true,
  noEmitOnErrors: true,
  splitChunks: {
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendor',
        chunks: 'all'
      }
    }
  },
  // 将 runtime chunk 保持分开以启用长期缓存
  runtimeChunk: {
    name: (entrypoint) => `runtime-${entrypoint.name}`
  }
}
