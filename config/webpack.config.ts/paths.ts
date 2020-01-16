import fs from 'fs'
import path from 'path'
import { isProd } from './constans'

// eslint-disable-next-line security/detect-non-literal-fs-filename
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath)

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx'
]

// 类似 webpack 的方式解析模块
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  )

  if (extension) {
    return resolveFn(`${filePath}.${extension}`)
  }

  return resolveFn(`${filePath}.js`)
}

const paths = {
  // init;
  resolveModules: [],
  appDist: resolveApp('dist/'),
  appPath: resolveApp('.'),
  appHtml: resolveApp('public/index.html'),
  clientDist: resolveApp('dist/client'),
  serverDist: resolveApp('dist/server'),
  dotenv: resolveApp('.env'),
  src: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appNodeModules: resolveApp('node_modules'),
  srcClient: resolveApp('src/client'),
  srcServer: resolveApp('src/server'),
  types: resolveApp('node_modules/@types'),
  // NOTE: prod 定义 cdn 域名, 注意: 路径不能写成 "dist/", 否则会定位不到对应的文件, 必须是: "/dist/"
  publicPath: isProd ? '' : 'http://localhost:3000/dist/',
  // 这个是填补 html 中的 PUBLIC_URL 变量
  publicUrl: isProd ? 'client/' : 'http://localhost:3000/',
  appPublic: resolveApp('public'),
  appPackageJson: resolveApp('package.json'),
  proxySetup: resolveApp('./setupProxy.ts'),
  appClientIndexJs: resolveModule(resolveApp, 'src/client/index'),
  appServerIndexJs: resolveModule(resolveApp, 'src/server/index'),
  yarnLockFile: resolveApp('yarn.lock')
}

paths.resolveModules = [paths.srcClient, paths.srcServer, paths.src, 'node_modules']

export default paths
