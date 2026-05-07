import { useState, useEffect, useRef } from 'react';
import { supabase, type SuggestionRow } from '../lib/supabase';
import { MessageSquare, Send } from 'lucide-react';

export default function SuggestionsPanel() {
  const [suggestions, setSuggestions] = useState<SuggestionRow[]>([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('suggestions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (data) setSuggestions(data as SuggestionRow[]);
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel('suggestions-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'suggestions' }, (payload) => {
        setSuggestions((prev) => [payload.new as SuggestionRow, ...prev]);
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
      <h2 className="font-bebas text-2xl text-[#FFD700] tracking-widest mb-4">
        Sugerencias y Comentarios
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Tu nombre"
            maxLength={50}
            className="w-36 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-white/30 text-sm font-barlow outline-none focus:border-[#FFD700]/60 transition-colors"
          />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribí tu sugerencia o comentario…"
            maxLength={300}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-white/30 text-sm font-barlow outline-none focus:border-[#FFD700]/60 transition-colors"
          />
          <button
            type="submit"
            disabled={sending || !author.trim() || !text.trim()}
            className="px-4 py-2 rounded-lg bg-[#FFD700] text-[#001440] font-barlow font-bold text-sm disabled:opacity-40 hover:bg-yellow-300 transition-colors flex items-center gap-1.5"
          >
            <Send size={14} />
            {sending ? '…' : 'Enviar'}
          </button>
        </div>
      </form>

      {/* List */}
      {loading ? (
        <div className="text-center text-white/40 py-8 font-barlow">Cargando…</div>
      ) : suggestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-white/40">
          <MessageSquare size={40} className="mb-3 opacity-50" />
          <p className="font-barlow text-lg">Todavía no hay sugerencias</p>
          <p className="font-barlow text-sm mt-1">¡Sé el primero en escribir!</p>
        </div>
      ) : (
        <div ref={listRef} className="space-y-3">
          {suggestions.map((s) => (
            <div key={s.id} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-barlow font-bold text-[#FFD700] text-sm">{s.author}</span>
                <span className="font-barlow text-white/30 text-xs">
                  {new Date(s.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="font-barlow text-white/80 text-sm leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
