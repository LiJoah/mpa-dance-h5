import chalk from 'chalk'
import { createServer } from 'http'
import Koa from 'koa'
import { serverPort } from '../configs/config.simple'
import { router } from './router'

// V8引擎对内存的使用有稍微的限制（1.4GB）要注意闭包, 注意内存泄露
class Server {
  public app: Koa = new Koa()
  constructor() {
    this.initServer()
  }

  private async initServer() {
    this.app.use(router.routes()).use(router.allowedMethods())

    const server = await createServer(this.app.callback()).listen(serverPort, function() {
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

new Server()
