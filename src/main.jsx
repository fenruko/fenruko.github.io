import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Easter egg for the people who open devtools. The rest of you never see this.
console.log(
  '%c RIFT %c you opened the console, so you get the truth: ' +
    'the casino money is not real, the music is. flag: rift{console_is_a_place_of_honor}',
  'background:#5865f2;color:#fff;font-weight:700;border-radius:3px;padding:2px 6px;',
  'color:#8b93a7;'
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
