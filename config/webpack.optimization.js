const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

const optimization = function (webpackEnv) {
  const isEnvProduction = webpackEnv === 'production';

  const isEnvProductionProfile =
    isEnvProduction && process.argv.includes('--profile');


  return {
    minimize: isEnvProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // 由于Uglify违反了看似有效的代码的问题而被禁用
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          // Added for profiling in devtools
          keep_classnames: isEnvProductionProfile,
          keep_fnames: isEnvProductionProfile,
          output: {
            ecma: 5,
            comments: false,
            // 处理表情符号和特殊的符号
            ascii_only: true,
          },
        },
        sourceMap: shouldUseSourceMap,
      }),

      // This is only used in production mode
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: shouldUseSourceMap
            ? {

              // `inline: false` : 强制将源映射输出到单独的文件中
              inline: false,
              // `annotation: true` 帮助浏览器更好的处理, 注释
              annotation: true,
            }
            : false,
        },
      }),
    ],
    // Automatically split vendor and commons
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    // 将 runtime chunk 保持分开以启用长期缓存
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    },
  }
}

module.exports = optimization;