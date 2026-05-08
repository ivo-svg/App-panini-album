import { Component, type ReactNode } from 'react';

interface State { error: Error | null }

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#000d2e' }}>
          <div className="max-w-lg w-full rounded-2xl p-6" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)' }}>
            <div className="font-bebas text-3xl text-red-400 tracking-widest mb-3">Error al cargar la app</div>
            <p className="font-barlow text-white/70 text-sm mb-4">
              Ocurrió un error inesperado. Copiá el mensaje de abajo y compartilo:
            </p>
            <pre className="text-xs text-red-300 bg-black/40 rounded-xl p-4 overflow-auto whitespace-pre-wrap break-all">
              {error.message}{'\n\n'}{error.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full py-3 rounded-xl font-bebas text-lg tracking-widest"
              style={{ background: 'linear-gradient(135deg, #B8860B, #FFD700)', color: '#001440' }}
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
