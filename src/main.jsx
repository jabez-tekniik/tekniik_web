import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/reset.css'
import './styles/tokens.css'
import './styles/global.css'
import './styles/theme-ink.css'
import App from './App.jsx'
import SmoothScroll from './motion/SmoothScroll.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SmoothScroll>
        <App />
      </SmoothScroll>
    </BrowserRouter>
  </StrictMode>,
)
