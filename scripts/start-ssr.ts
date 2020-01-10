import fs from 'fs'
import nodemon from 'nodemon'
import { choosePort, prepareProxy, prepareUrls } from 'react-dev-utils/WebpackDevServerUtils'
import webpack from 'webpack'
import getConfig from '../config/webpack.config.ts'
import createDevServerConfig from '../config/webpack.config.ts/client/dev.server.config'
import paths from '../config/webpack.config.ts/paths'

import { compilerPromise, logMessage } from './utils'

const [clientConfig, serverConfig] = getConfig(process.env.NODE_ENV || 'development')

// 设置浏览器, 不需要回到浏览器界面
import chalk from 'chalk'
import { checkBrowsers } from 'react-dev-utils/browsersHelper'
import WebpackDevServer from 'webpack-dev-server'
import { DEFAULT_PORT, HOST, protocol } from '../config/webpack.config.ts/constans'

checkBrowsers(paths.appPath)
  .then(() => {
    // 当默认的 port 被占用时, 我们就选择其他的端口
    return choosePort(HOST, DEFAULT_PORT)
  })
  .then(async (port) => {
    if (port == null) {
      // We have not found a port.
      return
    }
    chalk.cyan(`bind port: ${chalk.yellow(chalk.bold(port))}`)
    const urls = prepareUrls(protocol, HOST, port)

    // Load proxy config
    const proxySetting = require(paths.appPackageJson).proxy
    const proxyConfig = prepareProxy(proxySetting, paths.appPublic)

    // 在Web服务器上服务由编译器生成的Webpack资产。
    const clientDevServerConfig = createDevServerConfig(proxyConfig, urls.lanUrlForConfig)

    // webpackConfigs 包含了 client and server 的配置
    const multiCompiler = webpack([clientConfig, serverConfig])

    const clientCompiler: any = multiCompiler.compilers.find(
      (compiler) => compiler.name === 'client'
    )
    const serverCompiler: any = multiCompiler.compilers.find(
      (compiler) => compiler.name === 'server'
    )

    const clientPromise = compilerPromise('client', clientCompiler)
    const serverPromise = compilerPromise('server', serverCompiler)

    const watchOptions = {
      ignored: /node_modules/,
      stats: clientConfig.stats
    }

    // 负责 client 端的服务
    const devServer = new WebpackDevServer(clientCompiler, clientDevServerConfig)

    // Launch WebpackDevServer.
    devServer.listen(port, HOST, (err) => {
      if (err) {
        console.log(err)
        return console.log(err)
      }
      // if (isInteractive) {
      //   clearConsole()
      // }

      if (process.env.NODE_PATH) {
        console.log(
          chalk.yellow('不赞成将NODE_PATH设置为绝对解析模块，而建议在tsconfig.json 设置baseUrl')
        )
        console.log()
      }

      console.log(chalk.cyan('Starting the development server...\n'))
      console.log(chalk.cyan(`open browser with [${urls.localUrlForBrowser}] \n`))

      process.on('SIGTERM', function () {
        devServer.close()
        process.exit()
      })

      process.on('SIGINT', function () {
        devServer.close()
        process.exit()
      })
    })

    serverCompiler.watch(watchOptions, (error, stats) => {
      if (!error && !stats.hasErrors()) {
        console.log(stats.toString(serverConfig.stats))
        return
      }

      if (error) {
        logMessage(error, 'error')
      }

      if (stats.hasErrors()) {
        const info = stats.toJson()
        const errors = info.errors[0].split('\n')
        logMessage(errors[0], 'error')
        logMessage(errors[1], 'error')
        logMessage(errors[2], 'error')
      }
    })

    // wait until client and server is compiled
    try {
      await serverPromise
      await clientPromise
    } catch (error) {
      logMessage(error, 'error')
    }

    // NOTE: 负责重启服务器
    const script = nodemon({
      script: `${paths.serverDist}/server.js`,
      ignore: ['src', 'scripts', 'config', './*.*', 'dist/client', '**/locales', '**/tmp'],
      delay: 200
    })

    script.on('restart', () => {
      logMessage('Server side app has been restarted.', 'warning')
    })

    script.on('quit', () => {
      console.log('Process ended')
      process.exit()
    })

    script.on('error', () => {
      logMessage('An error occured. Exiting', 'error')
      process.exit(1)
    })
  })
  .catch((err) => {
    if (err && err.message) {
      console.log(err.message)
    }
    process.exit(1)
  })
