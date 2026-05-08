import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'

window.addEventListener('error', (e) => {
  const root = document.getElementById('root');
  if (root && !root.innerHTML.trim()) {
    root.innerHTML = `<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#000d2e;padding:24px"><div style="max-width:500px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.4);border-radius:16px;padding:24px"><div style="font-family:sans-serif;color:#f87171;font-size:20px;font-weight:bold;margin-bottom:12px">Error al cargar</div><pre style="font-family:monospace;font-size:11px;color:#fca5a5;white-space:pre-wrap;word-break:break-all">${e.message}\n${e.filename}:${e.lineno}</pre><button onclick="location.reload()" style="margin-top:16px;width:100%;padding:12px;background:#FFD700;color:#001440;border:none;border-radius:8px;font-weight:bold;cursor:pointer;font-size:14px">Reintentar</button></div></div>`;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
