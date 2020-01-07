const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const { shouldInlineRuntimeChunk, useTypeScript } = require("./consts")
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const getClientEnvironment = require('./env');
const webpack = require('webpack');
const resolve = require('resolve');
const paths = require('./paths');

module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  const publicPath = isEnvProduction
    ? paths.servedPath
    : isEnvDevelopment && '/';
  const publicUrl = isEnvProduction
    ? publicPath.slice(0, -1)
    : isEnvDevelopment && '';

  // Get environment variables to inject into our app.
  const env = getClientEnvironment(publicUrl);

  return [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: paths.appHtml,
        },
        isEnvProduction
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
              minifyURLs: true,
            },
          }
          : undefined
      )
    ),
    // Inlines the webpack runtime script. This script is too small to warrant
    // a network request.
    // https://github.com/facebook/create-react-app/issues/5358
    isEnvProduction &&
    shouldInlineRuntimeChunk &&
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    // This gives some necessary context to module not found errors, such as
    // the requesting resource.
    new ModuleNotFoundPlugin(paths.appPath),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV is set to production
    // during a production build.
    // Otherwise React will be compiled in the very slow development mode.
    new webpack.DefinePlugin(env.stringified),
    // This is necessary to emit hot updates (currently CSS only):
    isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebook/create-react-app/issues/240
    isEnvDevelopment && new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebook/create-react-app/issues/186
    isEnvDevelopment &&
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    isEnvProduction &&
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
    // Generate an asset manifest file with the following content:
    // - "files" key: Mapping of all asset filenames to their corresponding
    //   output file so that tools can pick it up without having to parse
    //   `index.html`
    // - "entrypoints" key: Array of files which are included in `index.html`,
    //   can be used to reconstruct the HTML if necessary
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: publicPath,
      generate: (seed, files, entrypoints) => {
        const manifestFiles = files.reduce((manifest, file) => {
          manifest[file.name] = file.path;
          return manifest;
        }, seed);
        const entrypointFiles = entrypoints.main.filter(
          fileName => !fileName.endsWith('.map')
        );

        return {
          files: manifestFiles,
          entrypoints: entrypointFiles,
        };
      },
    }),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Generate a service worker script that will precache, and keep up to date,
    // the HTML & assets that are part of the Webpack build.
    isEnvProduction &&
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      exclude: [/\.map$/, /asset-manifest\.json$/],
      importWorkboxFrom: 'cdn',
      navigateFallback: publicUrl + '/index.html',
      navigateFallbackBlacklist: [
        // Exclude URLs starting with /_, as they're likely an API call
        new RegExp('^/_'),
        // Exclude any URLs whose last part seems to be a file extension
        // as they're likely a resource and not a SPA route.
        // URLs containing a "?" character won't be blacklisted as they're likely
        // a route with query params (e.g. auth callbacks).
        new RegExp('/[^/?]+\\.[^/]+$'),
      ],
    }),
    // TypeScript type checking
    useTypeScript &&
    new ForkTsCheckerWebpackPlugin({
      typescript: resolve.sync('typescript', {
        basedir: paths.appNodeModules,
      }),
      async: isEnvDevelopment,
      useTypescriptIncrementalApi: true,
      checkSyntacticErrors: true,
      resolveModuleNameModule: process.versions.pnp
        ? `${__dirname}/pnpTs.js`
        : undefined,
      resolveTypeReferenceDirectiveModule: process.versions.pnp
        ? `${__dirname}/pnpTs.js`
        : undefined,
      tsconfig: paths.appTsConfig,
      reportFiles: [
        '**',
        '!**/__tests__/**',
        '!**/?(*.)(spec|test).*',
        '!**/src/setupProxy.*',
        '!**/src/setupTests.*',
      ],
      silent: true,
      // The formatter is invoked directly in WebpackDevServerUtils during development
      formatter: isEnvProduction ? typescriptFormatter : undefined,
    }),
  ].filter(Boolean)
}