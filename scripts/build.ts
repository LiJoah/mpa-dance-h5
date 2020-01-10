import { clientOnly } from './utils'

if (clientOnly()) {
  // tslint:disable-next-line:no-var-requires
  require('./build-client')
} else {
  // tslint:disable-next-line:no-var-requires
  require('./build-ssr')
}
