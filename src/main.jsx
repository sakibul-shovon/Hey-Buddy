import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import FindBuddy from './pages/FindBuddy.jsx'
import MicroProjectsPage from './pages/MicroProjectsPage.jsx'
import ShowcaseProjectsPage from './pages/ShowcaseProjectsPage.jsx'
import Dashboard from './pages/Dashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <Dashboard/> */}
    {/* <FindBuddy/> */}
    {/* <MicroProjectsPage/> */}
    {/* <ShowcaseProjectsPage /> */}
  </StrictMode>,
)

