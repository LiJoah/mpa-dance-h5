import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import postcssNormalize from 'postcss-normalize'
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent'
import { generateSourceMap, isDev, isProd } from './constans'

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/

const scssRegex = /\.scss$/
const scssModuleRegex = /\.module\.scss$/

// temporary wrapper function around getCSSModuleLocalIdent until this issue is resolved:
// https://github.com/webpack-contrib/css-loader/pull/965
const getLocalIdentWorkaround = (
  context: any,
  localIdentName: any,
  localName: any,
  options: any
) => {
  if (options && options.context === null) {
    options.context = undefined
  }
  return getCSSModuleLocalIdent(context, localIdentName, localName, options)
}

const getStyleLoaders = (cssOptions: any, preProcessor?: string, isClient = true) => {
  const loaders = [
    isClient && require.resolve('css-hot-loader'),
    isDev && require.resolve('style-loader'),
    isProd && MiniCssExtractPlugin.loader,
    {
      loader: require.resolve('css-loader'),
      options: cssOptions
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009'
            },
            stage: 3
          }),
          postcssNormalize()
        ],
        sourceMap: generateSourceMap
      }
    }
  ].filter(Boolean)
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: generateSourceMap
        }
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: isDev && true
        }
      }
    )
  }
  return loaders
}

const babelLoader = {
  test: /\.(js|jsx|ts|tsx|mjs)$/,
  exclude: /node_modules/,
  loader: require.resolve('babel-loader'),
  options: {
    plugins: [
      [
        require.resolve('babel-plugin-named-asset-import'),
        {
          loaderMap: {
            svg: {
              ReactComponent: '@svgr/webpack?-prettier,-svgo![path]'
            }
          }
        }
      ]
    ],
    cacheDirectory: true,
    // 关闭缓存压缩处理产生的错误
    cacheCompression: isProd,
    compact: isProd
  }
}

const cssModuleLoaderClient = {
  test: cssModuleRegex,
  use: getStyleLoaders({
    localsConvention: 'camelCase',
    modules: {
      // getLocalIdent: getCSSModuleLocalIdent,
      getLocalIdent: getLocalIdentWorkaround
    },
    importLoaders: 1,
    sourceMap: generateSourceMap
    // localIdentName: '[name]__[local]--[hash:base64:5]',
    // getLocalIdent: getCSSModuleLocalIdent,
  })
}

const cssLoaderClient = {
  test: cssRegex,
  exclude: cssModuleRegex,
  use: getStyleLoaders({})
}

const scssLoaderClient = {
  test: scssRegex,
  exclude: scssModuleRegex,
  use: getStyleLoaders({}, 'sass-loader')
}

const scssModuleLoaderClient = {
  test: scssModuleRegex,
  exclude: scssRegex,
  use: [
    ...getStyleLoaders({}),
    {
      loader: require.resolve('sass-loader'),
      options: {
        importLoaders: 2,
        sourceMap: generateSourceMap,
        modules: {
          getLocalIdent: getCSSModuleLocalIdent
        }
      }
    }
  ]
}

const cssModuleLoaderServer = {
  test: cssModuleRegex,
  use: getStyleLoaders(
    {
      onlyLocals: true,
      localsConvention: 'camelCase',
      importLoaders: 1,
      modules: {
        // getLocalIdent: getCSSModuleLocalIdent,
        getLocalIdent: getLocalIdentWorkaround
      }
    },
    '',
    false
  )
}

const cssLoaderServer = {
  test: cssRegex,
  exclude: cssModuleRegex,
  use: [
    isProd ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
    require.resolve('css-loader')
  ]
}

const urlLoaderClient = {
  test: /\.(bmp|png|jpe?g|gif|svg)$/,
  loader: require.resolve('url-loader'),
  options: {
    limit: 2048,
    name: 'assets/images/[name].[hash:8].[ext]'
  }
}

const urlLoaderServer = {
  ...urlLoaderClient,
  options: {
    ...urlLoaderClient.options,
    emitFile: false
  }
}

const fileLoaderClient = {
  exclude: [/\.(js|jsx|ts|tsx|css|mjs|html|ejs|json)$/],
  use: [
    {
      loader: require.resolve('file-loader'),
      options: {
        name: 'assets/media/[name].[hash:8].[ext]'
      }
    }
  ]
}

const fileLoaderServer = {
  exclude: [/\.(js|tsx|ts|tsx|css|mjs|html|ejs|json)$/],
  use: [
    {
      loader: require.resolve('file-loader'),
      options: {
        name: 'assets/media/[name].[hash:8].[ext]',
        emitFile: false
      }
    }
  ]
}

// NOTE: 添加新的 loader 必须要在 file-loader 之前
export const client = [
  // 不支持require，必须使用import做异步代码加载。
  { parser: { requireEnsure: false } },
  {
    // oneOf:规则数组，当规则匹配时，只使用第一个匹配规则
    oneOf: [
      babelLoader,
      cssModuleLoaderClient,
      cssLoaderClient,
      scssModuleLoaderClient,
      scssLoaderClient,
      urlLoaderClient,
      fileLoaderClient
    ]
  }
]

export const server = [
  {
    // oneOf:规则数组，当规则匹配时，只使用第一个匹配规则
    oneOf: [
      babelLoader,
      cssModuleLoaderServer,
      cssLoaderServer,
      urlLoaderServer,
      fileLoaderServer]
  }
]

export default { client, server }
