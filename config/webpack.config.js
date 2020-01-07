const path = require('path');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const modules = require('./modules');
const { shouldUseSourceMap, useTypeScript } = require("./consts")
const optimizationFactory = require("./webpack.optimization")
const moduleFactory = require("./webpack.module")
const pluginsFactory = require("./webpack.plugins")


const appPackageJson = require(paths.appPackageJson);


module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  const isEnvProductionProfile =
    isEnvProduction && process.argv.includes('--profile');

  const publicPath = isEnvProduction
    ? paths.servedPath
    : isEnvDevelopment && '/';
  return {
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',

    bail: isEnvProduction,
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',
    entry: [
      require.resolve('webpack-dev-server/client') + '?/',
      require.resolve('webpack/hot/dev-server'),
      isEnvDevelopment &&
      require.resolve('react-dev-utils/webpackHotDevClient'),
      paths.appIndexJs,
    ].filter(Boolean),
    output: {
      path: isEnvProduction ? paths.appBuild : undefined,

      pathinfo: isEnvDevelopment,
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : isEnvDevelopment && 'static/js/bundle.js',

      // TODO: remove this when upgrading to webpack 5
      futureEmitAssets: true,

      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isEnvDevelopment && 'static/js/[name].chunk.js',

      publicPath: publicPath,

      devtoolModuleFilenameTemplate: isEnvProduction
        ? info =>
          path
            .relative(paths.appSrc, info.absoluteResourcePath)
            .replace(/\\/g, '/')
        : isEnvDevelopment &&
        (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),

      jsonpFunction: `webpackJsonp${appPackageJson.name}`,

      globalObject: 'this',
    },
    optimization: optimizationFactory(webpackEnv),
    resolve: {

      modules: ['node_modules', paths.appNodeModules].concat(
        modules.additionalModulePaths || []
      ),

      extensions: paths.moduleFileExtensions
        .map(ext => `.${ext}`)
        .filter(ext => useTypeScript || !ext.includes('ts')),
      alias: {

        'react-native': 'react-native-web',

        // Allows for better profiling with ReactDevTools
        ...(isEnvProductionProfile && {
          'react-dom$': 'react-dom/profiling',
          'scheduler/tracing': 'scheduler/tracing-profiling',
        }),
        ...(modules.webpackAliases || {}),
      },

      plugins: [
        PnpWebpackPlugin,

        new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
      ],
    },
    resolveLoader: {
      plugins: [
        PnpWebpackPlugin.moduleLoader(module),
      ],
    },
    module: moduleFactory,
    plugins: pluginsFactory,

    // 导入 node 的模块, 但是不会在前端使用, 这里要告诉 webpack 将其当成一个空的模块
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },

    // 关闭性能处理
    performance: false,
  };
};
