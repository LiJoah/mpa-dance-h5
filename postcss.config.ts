import paths from './config/webpack.config.ts/paths'

export default {
  plugins: [
    require('postcss-import')({
      path: [paths.appPath, `${__dirname}/node_modules`],
    }),
    require('postcss-nested')(),
    require('postcss-flexbugs-fixes')(),
    require('autoprefixer')(),
    require('postcss-custom-properties')(),
    require('postcss-assets')({
      basePath: './assets',
    }),
    // This is broken.
    // require('postcss-normalize')(),
  ],
  sourceMap: true,
}
