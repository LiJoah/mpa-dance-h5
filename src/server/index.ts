import chalk from 'chalk'
import { createServer } from 'http'
import Koa from 'koa'
import { matchRoutes } from 'react-router-config'
import { serverPort } from '../configs/config.simple'
import routes from '../routes'
import { router } from './router'

// V8引擎对内存的使用有稍微的限制（1.4GB）要注意闭包, 注意内存泄露
class Server {
  public app: Koa = new Koa()
  constructor() {
    console.log(4)
    this.initServer()
  }

  private async initServer() {

    this.app.use(async (context, next) => {
      const path = context.path
      context.component = matchRoutes(routes, path)
      await next()
    })

    // 采用同构的方式, 直接使用 path 匹配到路由
    this.app.use(router.routes()).use(router.allowedMethods())

    const server = await createServer(this.app.callback()).listen(serverPort, function () {
      console.log(chalk.green(`⚒️ mpa-dance-h5 ssr-server listen on port ${serverPort}`))
    })

    server.addListener('error', (error: Error) => {
      const { message } = error
      if (/EADDRINUSE/g.test(message)) {
        process.exit(1)
      }
    })
  }
}

/**
 * 1. ssr 双端路由如何维护???
 * 两端使用同一套路由规则, server 通过 request url path 来寻找, 得到要渲染的组件
 * 2. 获取数据的方法和逻辑写在哪里 ???
 * 3. 服务端的 html 节点无法重复使用
 *
 * react ssr 的核心就是同构，没有同构的 ssr 是没有意义的。
 */

new Server()
