import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  fetchPapers, 
  getTotalPapersCount, 
  addCustomPaper, 
  getNews, 
  getHistory, 
  getRelevantPapers,
  type Paper 
} from './api';
import { askGemini, askWolf, type ChatMessage } from './llmAPI';

// Components
import Navigation from './components/Navigation';
import HomeHero from './components/HomeHero';
import LibraryExplorer from './components/LibraryExplorer';
import IntelligenceDesk from './components/IntelligenceDesk';
import ChroniclesTimeline from './components/ChroniclesTimeline';
import AISynthesis from './components/AISynthesis';
import ElderWolfChat from './components/ElderWolfChat';

type Tab = 'home' | 'explorer' | 'chat' | 'news' | 'history';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showSettings, setShowSettings] = useState(false);

  // App State
  const [searchQuery, setSearchQuery] = useState('');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loadingPapers, setLoadingPapers] = useState(false);

  // Wolf Chat State
  const [wolfChatHistory, setWolfChatHistory] = useState<ChatMessage[]>([]);
  const [wolfChatInput, setWolfChatInput] = useState('');
  const [wolfChatOpen, setWolfChatOpen] = useState(false);
  const [wolfChatLoading, setWolfChatLoading] = useState(false);

  // Synthesis State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Refs for auto-scroll
  const chatEndRef = useRef<HTMLDivElement>(null);
  const wolfChatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === 'chat') scrollToBottom(chatEndRef);
  }, [chatHistory, activeTab]);

  useEffect(() => {
    if (wolfChatOpen) scrollToBottom(wolfChatEndRef);
  }, [wolfChatHistory, wolfChatOpen]);

  // Contribute State
  const [showContribute, setShowContribute] = useState(false);
  const [contribTitle, setContribTitle] = useState('');
  const [contribAbstract, setContribAbstract] = useState('');
  const [contribAuthors, setContribAuthors] = useState('');
  const [contribYear, setContribYear] = useState('');
  const [contribUrl, setContribUrl] = useState('');
  const [contribError, setContribError] = useState('');
  const [contribSuccess, setContribSuccess] = useState('');

  const handleTabSwitch = (tab: Tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    handleSearch();
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoadingPapers(true);
    const results = await fetchPapers(searchQuery, 300);
    setPapers(results);
    setLoadingPapers(false);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !apiKey) return;

    // UPGRADE: Using ranking-based retrieval for context papers
    const contextPapers = getRelevantPapers(chatInput, 25);

    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: chatInput }];
    setChatHistory(newHistory);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await askGemini(
        chatInput,
        chatHistory,
        contextPapers,
        getTotalPapersCount(),
        getNews(),
        getHistory(),
        apiKey
      );
      setChatHistory([...newHistory, { role: 'model', content: response }]);
    } catch (err: any) {
      setChatHistory([...newHistory, { role: 'model', content: `Error: ${err.message}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  const speakWolf = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoices = voices.filter(v => 
      v.name.includes('Google US English') || v.name.includes('Daniel') || v.name.includes('Premium')
    );
    utterance.voice = preferredVoices[0] || voices[0];
    utterance.pitch = 0.6;
    utterance.rate = 0.85;
    utterance.volume = 0.7;
    window.speechSynthesis.speak(utterance);
  };

  const handleWolfChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wolfChatInput.trim() || !apiKey || wolfChatLoading) return;

    const newHistory: ChatMessage[] = [...wolfChatHistory, { role: 'user', content: wolfChatInput }];
    setWolfChatHistory(newHistory);
    const input = wolfChatInput;
    setWolfChatInput('');
    setWolfChatLoading(true);

    try {
      const response = await askWolf(input, wolfChatHistory, apiKey);
      setWolfChatHistory([...newHistory, { role: 'model', content: response }]);
      speakWolf(response);
    } catch (err: any) {
      setWolfChatHistory([...newHistory, { role: 'model', content: `The pack is restless... try again soon. (${err.message})` }]);
    } finally {
      setWolfChatLoading(false);
    }
  };

  const saveApiKey = (key: string) => {
    let cleanKey = key.trim();
    const half = cleanKey.length / 2;
    if (cleanKey.length > 20 && cleanKey.substring(0, half) === cleanKey.substring(half)) {
      cleanKey = cleanKey.substring(0, half);
    }
    setApiKey(cleanKey);
    localStorage.setItem('gemini_api_key', cleanKey);
    setShowSettings(false);
  };

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    setContribError('');
    setContribSuccess('');
    if (!contribTitle.trim() || !contribAbstract.trim()) {
      setContribError('Title and Abstract are required.');
      return;
    }
    const canidRegex = /\b(wolf|wolves|coyote|coyotes|canid|canids|canis|fox|foxes|jackal|dingo)\b/i;
    if (!canidRegex.test(contribTitle) && !canidRegex.test(contribAbstract)) {
      setContribError('Rejected: The document is not related to wild canids.');
      return;
    }
    const newPaper: Paper = {
      paperId: `custom-${Date.now()}`,
      title: contribTitle,
      abstract: contribAbstract,
      authors: contribAuthors.split(',').map(name => ({ name: name.trim() })),
      year: parseInt(contribYear) || new Date().getFullYear(),
      url: contribUrl,
      venue: 'User Contributed'
    };
    addCustomPaper(newPaper);
    setContribSuccess('Success! Paper added.');
    handleSearch();
    setTimeout(() => {
      setShowContribute(false);
      setContribTitle(''); setContribAbstract(''); setContribAuthors('');
      setContribYear(''); setContribUrl(''); setContribSuccess('');
    }, 2000);
  };

  return (
    <div className="app-container">
      <Navigation 
        activeTab={activeTab} 
        onTabSwitch={handleTabSwitch} 
        onToggleSettings={() => setShowSettings(!showSettings)} 
      />

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="modal-overlay"
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(10, 14, 23, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-panel" style={{ width: '400px', padding: '32px' }}>
              <h2 className="title-serif" style={{ marginBottom: '16px' }}>Configuration</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>Enter your Gemini API Key to unlock Synthesis.</p>
              <input type="password" placeholder="AIzaSy..." value={apiKey} onChange={e => setApiKey(e.target.value)} style={{ width: '100%', marginBottom: '24px' }} />
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn-secondary" onClick={() => setShowSettings(false)}>Close</button>
                <button className="btn-primary" onClick={() => saveApiKey(apiKey)}>Save Key</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contribute Modal */}
      <AnimatePresence>
        {showContribute && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(10, 14, 23, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-panel" style={{ width: '500px', padding: '32px' }}>
              <h2 className="title-serif" style={{ marginBottom: '16px' }}>Contribute Research</h2>
              <form onSubmit={handleContribute} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="Paper Title *" value={contribTitle} onChange={e => setContribTitle(e.target.value)} required />
                <textarea placeholder="Abstract *" value={contribAbstract} onChange={e => setContribAbstract(e.target.value)} rows={4} required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input type="text" placeholder="Authors" value={contribAuthors} onChange={e => setContribAuthors(e.target.value)} />
                  <input type="number" placeholder="Year" value={contribYear} onChange={e => setContribYear(e.target.value)} />
                </div>
                {contribError && <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{contribError}</p>}
                {contribSuccess && <p style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem' }}>{contribSuccess}</p>}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowContribute(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={!!contribSuccess}>Submit Protocol</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container" style={{ padding: '48px 24px', minHeight: 'calc(100vh - 72px)' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <HomeHero onTabSwitch={handleTabSwitch} latestNews={getNews()[0]} papers={papers} totalPapersCount={getTotalPapersCount()} />
          )}
          {activeTab === 'explorer' && (
            <LibraryExplorer 
              papers={papers} loadingPapers={loadingPapers} totalPapersCount={getTotalPapersCount()} 
              searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearchSubmit={handleSearch} 
              onShowContribute={() => setShowContribute(true)} 
            />
          )}
          {activeTab === 'news' && <IntelligenceDesk news={getNews()} />}
          {activeTab === 'history' && <ChroniclesTimeline history={getHistory()} onSearchInitiate={(q) => { setSearchQuery(q); handleTabSwitch('explorer'); }} />}
          {activeTab === 'chat' && (
            <AISynthesis 
              apiKey={apiKey} chatHistory={chatHistory} chatLoading={chatLoading} chatInput={chatInput} 
              onChatInputChange={setChatInput} onChatSubmit={handleChatSubmit} onShowSettings={() => setShowSettings(true)} 
              chatEndRef={chatEndRef} papersCount={papers.length} 
            />
          )}
        </AnimatePresence>
      </main>

      <ElderWolfChat 
        isOpen={wolfChatOpen} onToggle={() => setWolfChatOpen(!wolfChatOpen)} 
        chatHistory={wolfChatHistory} chatInput={wolfChatInput} onInputChange={setWolfChatInput} 
        onSubmit={handleWolfChatSubmit} isLoading={wolfChatLoading} chatEndRef={wolfChatEndRef} 
        apiKey={apiKey} 
      />
    </div>
  );
};

export default App;
