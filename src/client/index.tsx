import React from 'react'
import ReactDOM, { hydrate } from 'react-dom'
import { HelmetProvider } from 'react-helmet-async'
// import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
// import { compose, createStore } from 'redux'
// import { combineReducers } from 'redux'
import App from './App'
import createHistory from './base/history'
import * as serviceWorker from './serviceWorker'
import './styles/index.scss'

const history = createHistory()

// const reducer = combineReducers({})

// const store = createStore(reducer, {}, compose())

ReactDOM.render(<App />, document.getElementById('root'))

hydrate(
  <Router history={history}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </Router>,
  document.getElementById('app')
)

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept()
  }

  if (!window.store) {
    window.store = store
  }
}

serviceWorker.unregister()
