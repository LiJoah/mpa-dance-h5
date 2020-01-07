import React from 'react'
import logo from './assets/images/logo.svg'
import './styles/App.css'

const App: React.FC = () => {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
      </header>
    </div>
  )
}

export default App
