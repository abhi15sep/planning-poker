import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Determine basename based on environment
const basename = import.meta.env.PROD ? '/planning-poker' : ''

// Handle SPA redirect from 404.html
const redirect = sessionStorage.getItem('redirect')
if (redirect && basename) {
  sessionStorage.removeItem('redirect')
  const path = redirect.replace(basename, '') || '/'
  window.history.replaceState(null, '', basename + path)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
