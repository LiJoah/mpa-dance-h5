declare module 'write-file-webpack-plugin'

declare const __BROWSER__: boolean
declare const __SERVER__: boolean

interface Window {
  browserHistory: any
  store: any
  __PRELOADED_STATE__: any
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
}
