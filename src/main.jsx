import React from 'react'
import ReactDOM from 'react-dom/client'
import { SWRConfig } from 'swr'

import './index.css'
import App from './App'

async function fetchWithAuth(resource, init) {
  const access_token = sessionStorage.getItem("access_token");
  const r = await fetch(resource, {
    headers: {
      'Authorization': `Bearer ${access_token}`,
      ...init
    }
  })
  const res = await r.json();
  return res;
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SWRConfig value={{ fetcher: fetchWithAuth }}>
      <App />
    </SWRConfig>
  </React.StrictMode>,
)
