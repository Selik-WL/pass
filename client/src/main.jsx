import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

import App from './App.jsx'
import { AppContextProvider } from './context/AppContext'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AppContextProvider>
            <App />
        </AppContextProvider>
    </StrictMode>,
)
