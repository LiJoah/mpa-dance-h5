import fs from 'fs'
import path from 'path'
import paths from './webpack.config.ts/paths'

// NOTE: 拿到最新的 paths 数据
delete require.cache[require.resolve('./webpack.config.ts/paths')]

if (!process.env.NODE_ENV) {
  throw new Error('process.env.NODE_ENV 必须设置')
}

const dotenvFiles = [
  `${paths.dotenv}.${process.env.NODE_ENV}.local`,
  `${paths.dotenv}.${process.env.NODE_ENV}`,
  process.env.NODE_ENV !== 'test' && `${paths.dotenv}.local`,
  paths.dotenv
].filter(Boolean)

dotenvFiles.forEach((dotenvFile: string) => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv').config({
      path: dotenvFile
    })
  }
})

const appDirectory = fs.realpathSync(process.cwd())
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter((folder: string) => folder && !path.isAbsolute(folder))
  .map((folder: string) => path.resolve(appDirectory, folder))
  .join(path.delimiter)

const REACT_APP = /^REACT_APP_/i

export default (): { stringified: any; raw: any } => {
  const raw = Object.keys(process.env)
    .filter((key) => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key]
        return env
      },
      {
        PORT: process.env.PORT || 8500,
        NODE_ENV: process.env.NODE_ENV || 'development',
        HOST: process.env.HOST || 'http://localhost',

        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        PUBLIC_URL: paths.publicUrl
      }
    )

  // 字符串化所有值，以便我们可以将其输入到 Webpack DefinePlugin 中
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key])
      return env
    }, {})
  }

  return { raw, stringified }
}
