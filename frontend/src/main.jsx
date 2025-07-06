import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DrawerProvider } from "./context/DrawerContext";


import {BrowserRouter} from "react-router-dom"
import { ToastProvider } from "../components/ToastContext.jsx";
import ChatProvider from './context/ChatProvider.jsx'

createRoot(document.getElementById('root')).render(

    
    <BrowserRouter>
    <ChatProvider>
    <ToastProvider>
       <DrawerProvider>
      <App />
      </DrawerProvider>
     
    </ToastProvider>
    </ChatProvider>
    </BrowserRouter>
    
  
)
