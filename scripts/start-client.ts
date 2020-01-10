import chalk from 'chalk'
import fs from 'fs'
import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import createDevServerConfig from '../config/webpack.config.ts/client/dev.server.config'

import clearConsole from 'react-dev-utils/clearConsole'
import {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls
} from 'react-dev-utils/WebpackDevServerUtils'
// import openBrowser from 'react-dev-utils/openBrowser';
import getConfig from '../config/webpack.config.ts'
import { DEFAULT_PORT, HOST, isInteractive, protocol } from '../config/webpack.config.ts/constans'
import paths from '../config/webpack.config.ts/paths'

if (!checkRequiredFiles([paths.appHtml, paths.appClientIndexJs])) {
  process.exit(1)
}

// 涉及C9云部署时的环境变量检查
if (HOST) {
  console.log(chalk.cyan(`尝试绑定到HOST环境变量: ${chalk.yellow(chalk.bold(HOST))}`))
  console.log('如果不是故意的; 请检查当前环境变量; 是否有错误的设置')
  console.log(`Learn more here: ${chalk.yellow('https://bit.ly/CRA-advanced-config')}`)
  console.log()
}

const webpackConfig = getConfig(process.env.NODE_ENV || 'development') as webpack.Configuration[]
const [clientConfig] = webpackConfig

const useYarn = fs.existsSync(paths.yarnLockFile)

// 设置浏览器, 不需要回到浏览器界面
import { checkBrowsers } from 'react-dev-utils/browsersHelper'

checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // 当默认的 port 被占用时, 我们就选择其他的端口
    return choosePort(HOST, DEFAULT_PORT)
  })
  .then((port) => {
    if (port == null) {
      // We have not found a port.
      return
    }
    chalk.cyan(`bind port: ${chalk.yellow(chalk.bold(port))}`)
    const appName = require(paths.appPackageJson).name
    const urls = prepareUrls(protocol, HOST, port)
    const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true'
    const useTypeScript = fs.existsSync(paths.appTsConfig)

    const devSocket = {
      warnings: (warnings) =>
        (devServer as any).sockWrite((devServer as any).sockets, 'warnings', warnings),
      errors: (errors) => (devServer as any).sockWrite((devServer as any).sockets, 'errors', errors)
    }
    const opts = {
      appName,
      config: clientConfig,
      devSocket,
      urls,
      useYarn,
      useTypeScript,
      tscCompileOnError,
      webpack
    }
    const compiler = createCompiler(opts)

    // Load proxy config
    const proxySetting = require(paths.appPackageJson).proxy
    const proxyConfig = prepareProxy(proxySetting, paths.appPublic)

    // 在Web服务器上服务由编译器生成的Webpack资产。
    const serverConfig = createDevServerConfig(proxyConfig, urls.lanUrlForConfig)
    const devServer = new WebpackDevServer(compiler, serverConfig)
    // Launch WebpackDevServer.
    devServer.listen(port, HOST, (err) => {
      if (err) {
        return console.log(err)
      }
      if (isInteractive) {
        clearConsole()
      }

      // We used to support resolving modules according to `NODE_PATH`.
      // This now has been deprecated in favor of jsconfig/tsconfig.json
      // This lets you use absolute paths in imports inside large monorepos:
      if (process.env.NODE_PATH) {
        console.log(
          chalk.yellow(
            'Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.'
          )
        )
        console.log()
      }

      console.log(chalk.cyan('Starting the development server...\n'))
      console.log(chalk.cyan(`open browser with [${urls.localUrlForBrowser}] \n`))

      process.on('SIGTERM', function() {
        devServer.close()
        process.exit()
      })

      process.on('SIGINT', function() {
        devServer.close()
        process.exit()
      })
    })
  })
  .catch((err) => {
    if (err && err.message) {
      console.log(err.message)
    }
    process.exit(1)
  })
