import Router from 'koa-router'
import { serverRender } from './views'

export const router = new Router()

router.get('*', serverRender)
