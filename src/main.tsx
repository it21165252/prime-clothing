import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import ComingSoonPage from './pages/ComingSoonPage.tsx'
import { shouldShowComingSoon } from './lib/comingSoon'

// primeclothing.lk shows only the Coming Soon page (every route, no header/footer).
// localhost, LAN and *.vercel.app show the full store. See src/lib/comingSoon.ts.
const comingSoon = shouldShowComingSoon()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {comingSoon ? (
      <ComingSoonPage />
    ) : (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )}
  </StrictMode>,
)
