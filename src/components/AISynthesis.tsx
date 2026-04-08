import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AISynthesisProps {
  apiKey: string;
  chatHistory: any[];
  chatLoading: boolean;
  chatInput: string;
  onChatInputChange: (val: string) => void;
  onChatSubmit: (e: React.FormEvent) => void;
  onShowSettings: () => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  papersCount: number;
}

export const AISynthesis: React.FC<AISynthesisProps> = ({
  apiKey,
  chatHistory,
  chatLoading,
  chatInput,
  onChatInputChange,
  onChatSubmit,
  onShowSettings,
  chatEndRef,
  papersCount
}) => {
  return (
    <motion.div
      key="chat"
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div style={{ marginBottom: '24px' }}>
        <h2 className="title-serif" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>AI Synthesis</h2>
        <p style={{ color: 'var(--text-muted)' }}>Engage with an AI grounded in the papers from your Library view.</p>
      </div>

      {!apiKey && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'baseline', gap: '16px', backgroundColor: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
          <AlertCircle color="var(--accent-amber)" />
          <div style={{ flex: 1 }}>
            <h4 style={{ color: 'var(--accent-amber)', marginBottom: '8px' }}>API Key Required</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>You must configure your Gemini API Key in the settings to activate the RAG synthesis features.</p>
          </div>
          <button className="btn-secondary" onClick={onShowSettings}>Settings</button>
        </div>
      )}

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '500px', marginTop: apiKey ? '0' : '24px' }}>
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {chatHistory.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', maxWidth: '400px' }}>
              <Sparkles size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p>Ask a question about wolf pack dynamics, coyote range expansion, or general canid ecology.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '12px', opacity: 0.7 }}>The AI will synthesize answers drawing exclusively from the abstracts of {papersCount} currently loaded papers.</p>
            </div>
          ) : (
            chatHistory.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '85%', padding: '16px 24px', borderRadius: '12px',
                  background: msg.role === 'user' ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-secondary)',
                  border: `1px solid ${msg.role === 'user' ? 'var(--accent-amber-glow)' : 'var(--border-color)'}`,
                  color: 'var(--text-primary)', lineHeight: 1.6,
                  fontSize: '1rem',
                }} className={msg.role === 'model' ? 'markdown-body' : ''}>
                  {msg.role === 'user' ? (
                    <p>{msg.content}</p>
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))
          )}
          {chatLoading && (
            <div style={{ alignSelf: 'flex-start', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', color: 'var(--text-muted)' }}>
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                Synthesizing from library context...
              </motion.div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={onChatSubmit} style={{ padding: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={chatInput}
            onChange={e => onChatInputChange(e.target.value)}
            placeholder="E.g., How do coyotes adapt to urban environments?"
            style={{ flex: 1 }}
            disabled={!apiKey || chatLoading}
          />
          <button type="submit" className="btn-primary" disabled={!apiKey || chatLoading || !chatInput.trim()}>
            Send Query
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AISynthesis;
