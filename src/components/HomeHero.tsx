import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Newspaper, PawPrint, Activity, BookOpen, MessageSquare, Compass } from 'lucide-react';

interface HomeHeroProps {
  onTabSwitch: (tab: any) => void;
  latestNews: { title: string; date: string };
  papers: any[];
  totalPapersCount: number;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onTabSwitch, latestNews, papers, totalPapersCount }) => {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '48px', alignItems: 'center', textAlign: 'center', paddingTop: '40px' }}
    >
      <div style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-glass)', padding: '6px 16px', borderRadius: '24px', border: '1px solid var(--border-glow)', color: 'var(--accent-amber)' }}>
            <Sparkles size={16} /> <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Research Intelligence</span>
          </div>

          {/* News Ticker */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}
          >
            <Newspaper size={14} /> <strong>LATEST:</strong> {latestNews.title} — {latestNews.date}
          </motion.div>
        </div>
        <h1 className="title-serif" style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '24px' }}>
          Unveiling the <PawPrint size={40} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 8px' }} /> <span className="amber-gradient-text">Wild Canids</span> of North America.
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '40px' }}>
          An open-source intelligence platform dynamically aggregating peer-reviewed literature and utilizing AI to synthesize research on wolves, coyotes, and wild canid species.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn-primary" onClick={() => onTabSwitch('explorer')}>Explore the Library</button>
          <button className="btn-secondary" onClick={() => onTabSwitch('chat')}>Consult the AI</button>
        </div>
      </div>

      {/* Live Intelligence Telemetry Stream */}
      <div 
        className="glass-panel sentinel-scan" 
        style={{ 
          width: '100%', 
          maxWidth: '1000px', 
          padding: '16px 24px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '24px',
          background: 'rgba(10, 14, 23, 0.4)',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          color: 'var(--text-muted)',
          borderLeft: '2px solid var(--accent-blue)',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)', fontWeight: 700 }}>
          <Activity size={14} className="holographic-pulse" />
          LIVE_SCAN:
        </div>
        <div style={{ flex: 1, whiteSpace: 'nowrap', position: 'relative' }}>
          <motion.div
            animate={{ x: ['100%', '-100%'] }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            style={{ display: 'flex', gap: '48px' }}
          >
            {papers.slice(0, 15).map((p, i) => (
              <span key={i} style={{ opacity: 0.6 }}>
                <span style={{ color: 'var(--accent-amber)' }}>[DOC_{i + 1024}]</span> {p.title.toUpperCase()}
              </span>
            ))}
          </motion.div>
        </div>
        <div style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>
          SECURE_LINK_ACTIVE
        </div>
      </div>

      {/* Decorative stats/cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', width: '100%', marginTop: '40px' }}>
        {[
          { icon: <BookOpen size={24} color="var(--accent-emerald)" />, title: 'Vast Library', desc: `${totalPapersCount}+ curated peer-reviewed papers.` },
          { icon: <MessageSquare size={24} color="var(--accent-blue)" />, title: 'RAG Architecture', desc: 'Ask questions dynamically grounded in real citations.' },
          { icon: <Compass size={24} color="var(--accent-amber)" />, title: 'Open Science', desc: 'Hostable entirely via GitHub Pages without proprietary backends.' }
        ].map((feature, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
            <div style={{ marginBottom: '16px' }}>{feature.icon}</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{feature.title}</h3>
            <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default HomeHero;
