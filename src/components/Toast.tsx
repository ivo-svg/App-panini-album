import { useEffect, useState } from 'react';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'duplicate' | 'error' | 'info';
}

interface Props {
  toasts: ToastMessage[];
  onRemove: (id: number) => void;
}

const colors: Record<ToastMessage['type'], string> = {
  success: 'bg-emerald-600 border-emerald-400',
  duplicate: 'bg-orange-500 border-orange-300',
  error: 'bg-red-600 border-red-400',
  info: 'bg-blue-700 border-blue-400',
};

export default function Toast({ toasts, onRemove }: Props) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: number) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={`
        pointer-events-auto px-5 py-2.5 rounded-full border text-white text-sm font-semibold
        shadow-xl transition-all duration-300 font-barlow tracking-wide
        ${colors[toast.type]}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {toast.text}
    </div>
  );
}
