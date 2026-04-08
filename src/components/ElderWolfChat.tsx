import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint, X } from 'lucide-react';

interface ElderWolfChatProps {
  isOpen: boolean;
  onToggle: () => void;
  chatHistory: any[];
  chatInput: string;
  onInputChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  apiKey: string;
}

export const ElderWolfChat: React.FC<ElderWolfChatProps> = ({
  isOpen,
  onToggle,
  chatHistory,
  chatInput,
  onInputChange,
  onSubmit,
  isLoading,
  chatEndRef,
  apiKey
}) => {
  return (
    <>
      <div className="wolf-chat-bubble" onClick={onToggle}>
        {isOpen ? <X size={24} color="#000" /> : <PawPrint size={30} color="#000" className="howl-animation" />}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="wolf-chat-window holographic-glass"
          >
            <div className="wolf-chat-header">
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PawPrint size={20} color="var(--accent-emerald)" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>The Elder Wolf</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', opacity: 0.8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }}></div>
                  Observing the wild
                </div>
              </div>
            </div>

            <div className="wolf-chat-messages">
              {chatHistory.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', margin: 'auto' }}>
                  "The scent of a stranger... Speak, Two-Legged. What seeks your spirit in our territory?"
                </div>
              )}
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`wolf-msg ${msg.role === 'user' ? 'wolf-msg-user' : 'wolf-msg-ai'}`}>
                  {msg.content}
                </div>
              ))}
              {isLoading && <div className="wolf-msg wolf-msg-ai">...</div>}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={onSubmit} style={{ padding: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={e => onInputChange(e.target.value)}
                placeholder={apiKey ? "Speak to the Elder Wolf..." : "API Key Required in Settings"}
                style={{ flex: 1, padding: '8px 12px', fontSize: '0.9rem' }}
                disabled={!apiKey || isLoading}
              />
              <button type="submit" className="btn-primary" style={{ padding: '8px 12px' }} disabled={!apiKey || isLoading || !chatInput.trim()}>
                Howl
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ElderWolfChat;
