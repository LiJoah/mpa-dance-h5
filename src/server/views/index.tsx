import { BaseContext } from 'koa'
import React from 'react'
// import { StaticRouter } from 'react-router'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from '../../client/App'

const wrap = (url: string, children: React.ComponentElement<any, any>) => {
  return <StaticRouter location={url} context={{}}>
    <App>{children}</App>
  </StaticRouter>

}

export async function serverRender(ctx: BaseContext) {
  const Comp = (ctx as any).component
  const { title } = await Comp.getInitialProps()
  const html = renderToString(wrap(ctx.url, <Comp title={title} />))
  return ctx.body = html
}
