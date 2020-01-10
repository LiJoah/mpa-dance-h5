import rimraf from 'rimraf'
import paths from '../config/webpack.config.ts/paths'
import { clientOnly } from './utils'

rimraf.sync(paths.clientDist)
rimraf.sync(paths.serverDist)

if (clientOnly()) {
    // tslint:disable-next-line: no-var-requires
    require('./start-client')
} else {
    // tslint:disable-next-line:no-var-requires
    require('./start-ssr')
}
