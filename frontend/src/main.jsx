import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import { Provider } from "./components/ui/provider";



import {BrowserRouter} from "react-router-dom"
import { ToastProvider } from "../components/ToastContext.jsx";
import ChatProvider from './context/ChatProvider.jsx'

createRoot(document.getElementById('root')).render(

    
    <BrowserRouter>
    <ChatProvider>
    <ToastProvider>
      {/* <Provider> */}
      <App />
      {/* </Provider> */}
    </ToastProvider>
    </ChatProvider>
    </BrowserRouter>
    
  
)
