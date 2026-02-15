import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Handle SPA redirect from 404.html
const redirect = sessionStorage.getItem('redirect')
if (redirect) {
  sessionStorage.removeItem('redirect')
  const path = redirect.replace('/poker', '') || '/'
  window.history.replaceState(null, '', '/poker' + path)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/poker">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
