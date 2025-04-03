import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './shared/App.tsx'
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(

  <BrowserRouter basename="/Study-Web">
      <App />
  </BrowserRouter>
)