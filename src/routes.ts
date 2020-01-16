import { RouteConfig } from 'react-router-config'
import HomePage from './client/pages/home'
const routes: RouteConfig[] = [

  {
    path: '/',
    exact: true,
    component: HomePage as React.ComponentClass<any, any>
  },
  {
    path: '/detail',
    exact: true,
    component: HomePage as React.ComponentClass<any, any>
  }
]

// 导出路由表
export default routes
