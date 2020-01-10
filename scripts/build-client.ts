import chalk from 'chalk'
import rimraf from 'rimraf'
import webpack from 'webpack'
import getConfig from '../config/webpack.config.ts'
import paths from '../config/webpack.config.ts/paths'
import { compilerPromise, logMessage } from './utils'
const webpackConfig = getConfig(process.env.NODE_ENV || 'development')

const build = async () => {
  rimraf.sync(paths.clientDist)
  rimraf.sync(paths.serverDist)

  const [clientConfig] = webpackConfig
  const webpackCompiler = webpack([clientConfig])

  const clientCompiler = webpackCompiler.compilers.find((compiler) => compiler.name === 'client')
  const clientPromise = compilerPromise('client', clientCompiler)

  clientCompiler.watch({}, (error: any, stats: any) => {
    if (!error && !stats.hasErrors()) {
      console.log(stats.toString(clientConfig.stats))
      return
    }
    console.error(chalk.red(stats.compilation.errors))
  })

  // wait until client and server is compiled
  try {
    await clientPromise
    logMessage('Done!', 'info')
    process.exit()
  } catch (error) {
    logMessage(error, 'error')
  }
}

build()
