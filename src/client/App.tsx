import React from 'react'
import logo from '../assets/images/logo.svg'
import './styles/App.scss'

const App: React.FC = () => {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <span>test: test</span>
      </header>
    </div>
  )
}

export default App

// TODO:
// "pre-commit": "lint-staged",
// "post-merge": "install-deps-postmerge"
