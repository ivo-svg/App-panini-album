import { useState, useEffect, useRef } from 'react';
import { supabase, type SuggestionRow } from '../lib/supabase';
import { Send, MessageCircle } from 'lucide-react';

export default function SuggestionsPanel() {
  const [suggestions, setSuggestions] = useState<SuggestionRow[]>([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('suggestions')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);
      if (data) setSuggestions(data as SuggestionRow[]);
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel('suggestions-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'suggestions' }, (payload) => {
        setSuggestions((prev) => [...prev, payload.new as SuggestionRow]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    setSending(true);
    await supabase.from('suggestions').insert({ author: author.trim(), text: text.trim() });
    setText('');
    setSending(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden p-5 mb-6" style={{ background: 'linear-gradient(135deg, #0a1628, #001a4d)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23FFD700'/%3E%3C/svg%3E")` }} />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center">
            <MessageCircle size={28} className="text-[#FFD700]" />
          </div>
          <div>
            <div className="font-bebas text-3xl text-[#FFD700] tracking-widest leading-none">Sugerencias y Comentarios</div>
            <div className="font-barlow text-white/50 text-sm mt-0.5">
              Todos ven los mensajes en tiempo real
            </div>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="mb-5 space-y-3 max-h-[50vh] overflow-y-auto pr-1">
        {loading ? (
          <div className="text-center py-12">
            <div className="font-bebas text-[#FFD700]/30 text-2xl tracking-widest animate-pulse">CARGANDO…</div>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/20">
            <div className="text-5xl mb-4 opacity-50">💬</div>
            <p className="font-bebas text-xl tracking-widest text-white/30">Nadie escribió aún</p>
            <p className="font-barlow text-sm mt-1">¡Sé el primero!</p>
          </div>
        ) : (
          suggestions.map((s, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={s.id}
                className={`flex gap-3 ${isEven ? 'justify-start' : 'justify-end'}`}
              >
                {isEven && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFD700] to-yellow-600 flex items-center justify-center flex-shrink-0 font-bebas text-[#001440] text-sm shadow">
                    {s.author.charAt(0).toUpperCase()}
                  </div>
                )}
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-3 shadow-lg"
                  style={{
                    background: isEven
                      ? 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.06))'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                    border: `1px solid ${isEven ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.1)'}`,
                    borderTopLeftRadius: isEven ? '4px' : '16px',
                    borderTopRightRadius: isEven ? '16px' : '4px',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-barlow font-bold text-[#FFD700] text-sm">{s.author}</span>
                    <span className="font-barlow text-white/25 text-xs">
                      {new Date(s.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="font-barlow text-white/85 text-sm leading-relaxed">{s.text}</p>
                </div>
                {!isEven && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 font-bebas text-white text-sm shadow">
                    {s.author.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-4"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Tu nombre"
            maxLength={30}
            className="w-32 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white placeholder:text-white/30 text-sm font-barlow outline-none focus:border-[#FFD700]/60 transition-colors"
          />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribí tu sugerencia o comentario…"
            maxLength={300}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white placeholder:text-white/30 text-sm font-barlow outline-none focus:border-[#FFD700]/60 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={sending || !author.trim() || !text.trim()}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bebas text-lg tracking-widest transition-all disabled:opacity-40 hover:scale-[1.02] active:scale-95"
          style={{ background: 'linear-gradient(135deg, #B8860B, #FFD700)', color: '#001440' }}
        >
          <Send size={16} />
          {sending ? 'Enviando…' : 'Enviar Comentario'}
        </button>
      </form>
    </div>
  );
}
