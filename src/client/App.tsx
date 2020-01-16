import React from 'react'
import { renderRoutes } from 'react-router-config'
import { BrowserRouter } from 'react-router-dom'
import routes from '../routes'
import './styles/App.scss'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {renderRoutes(routes)}
    </BrowserRouter>
  )
}

export default App

// TODO:
// "pre-commit": "lint-staged",
// "post-merge": "install-deps-postmerge"

/**
 * 思考: 使用 webpack-dev-server 作为开发时的静态资源的服务器,
 * ssr-server 只做页面的渲染
 */
