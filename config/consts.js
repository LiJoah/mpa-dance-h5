const paths = require('./paths');
const fs = require('fs');
module.exports = {
  // Source maps are resource heavy and can cause out of memory issue for large source files.
  shouldUseSourceMap: process.env.GENERATE_SOURCEMAP !== 'false',

  // Some apps do not need the benefits of saving a web request, so not inlining the chunk
  // makes for a smoother build process.
  shouldInlineRuntimeChunk: process.env.INLINE_RUNTIME_CHUNK !== 'false',
  imageInlineSizeLimit: parseInt(
    process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
  ),
  // Check if TypeScript is setup
  useTypeScript: fs.existsSync(paths.appTsConfig)

}