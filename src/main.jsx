import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/reset.css'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.jsx'
import LazyMotionProvider from './motion/LazyMotionProvider.jsx'
import SmoothScroll from './motion/SmoothScroll.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LazyMotionProvider>
      <BrowserRouter>
        <SmoothScroll>
          <App />
        </SmoothScroll>
      </BrowserRouter>
    </LazyMotionProvider>
  </StrictMode>,
)
