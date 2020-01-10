import fs from 'fs'
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware'
import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware'
import ignoredFiles from 'react-dev-utils/ignoredFiles'
import noopServiceWorkerMiddleware from 'react-dev-utils/noopServiceWorkerMiddleware'
import WebpackDevServer from 'webpack-dev-server'
import { DANGEROUSLY_DISABLE_HOST_CHECK, host, isHttps } from '../constans'
import paths from '../paths'

export default function(proxy, allowedHost): WebpackDevServer.Configuration {
  console.log(paths.appDist)
  return {
    disableHostCheck: !proxy || DANGEROUSLY_DISABLE_HOST_CHECK,

    inline: true,
    // Enable gzip compression of generated files.: 开启 gzip 压缩
    compress: true,

    // 去掉WebpackDevServer's日志，但是会显示编译错误以及警告
    clientLogLevel: 'none',

    // 告诉服务器从哪个目录中提供内容。
    // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
    contentBase: paths.appDist,

    // 默认情况下，来自“ contentBase”的文件不会触发页面重新加载。
    watchContentBase: true,

    // 模块热更新，css有效，js等其他的需要自己利用loder配置
    hot: true,

    // 使用 `ws` 取代 `sockjs-node`;
    transportMode: 'ws',

    // 防止WS客户端被注入 `webpackHotDevClient`.
    injectClient: false,

    // devServer.publicPath 将用于确定应该从哪里提供 bundle，并且此选项优先。
    publicPath: paths.publicPath,

    // WebpackDevServer默认情况下非常的混乱，
    // 因此我们发出自定义消息，而不是通过上面的`compiler.hooks [...].tap`调用来侦听编译器事件
    quiet: true,

    // 据说: 这样可以避免某些系统上的CPU过载。src/node_modules is not ignored to support absolute imports
    watchOptions: {
      ignored: ignoredFiles(paths.src)
    },

    // 使用 https
    https: isHttps,
    host,

    overlay: false,
    historyApiFallback: {
      // 带点的路径仍应使用历史记录后备。
      // See https://github.com/facebook/create-react-app/issues/387.
      disableDotRule: true
    },
    public: allowedHost,
    proxy,
    // before: 在服务内部的所有其他中间件之前， 提供执行自定义中间件的功能。 这可以用来配置自定义处理程序
    before(app, server) {
      if (fs.existsSync(paths.proxySetup)) {
        // 注册代理中间件: TODO:
        require(paths.proxySetup)(app)
      }

      // 这使我们可以从 webpack 获取源内容以进行错误覆盖
      app.use(evalSourceMapMiddleware(server))
      // 这使我们可以从运行时错误覆盖中打开文件。
      app.use(errorOverlayMiddleware())

      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      app.use(noopServiceWorkerMiddleware())
    }
  }
}
