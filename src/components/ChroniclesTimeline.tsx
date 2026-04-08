import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Search } from 'lucide-react';

interface ChroniclesTimelineProps {
  history: any[];
  onSearchInitiate: (query: string) => void;
}

export const ChroniclesTimeline: React.FC<ChroniclesTimelineProps> = ({ history, onSearchInitiate }) => {
  return (
    <motion.div
      key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="perspective-container"
    >
      <div style={{ marginBottom: '60px', textAlign: 'center' }}>
        <h2 className="title-serif" style={{ fontSize: '3.5rem', marginBottom: '8px', filter: 'drop-shadow(0 0 20px var(--accent-amber-glow))' }}>Chronicles</h2>
        <div style={{ width: '80px', height: '4px', background: 'var(--accent-amber)', margin: '16px auto', borderRadius: '2px' }}></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>A deep-time odyssey of the Canidae lineage in North America.</p>
      </div>

      <div style={{ position: 'relative', paddingLeft: '60px', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="timeline-glow-line"></div>

        {history.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15, duration: 0.6 }}
            style={{ position: 'relative', marginBottom: '64px' }}
          >
            <div className="floating-dot"></div>
            <div className="chronicle-card-3d holographic-glass glass-panel" style={{ padding: '32px', position: 'relative' }}>
              <div className="year-stamp" style={{ fontSize: '1.5rem', marginBottom: '16px', display: 'inline-block' }}>{item.period}</div>
              <h3 className="title-serif" style={{ fontSize: '2rem', marginBottom: '12px', color: '#fff' }}>{item.event}</h3>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.8, marginBottom: '24px', fontSize: '1.05rem', opacity: 0.9 }}>{item.description}</p>

              {item.links && item.links.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', fontWeight: 700 }}>Analysis Files</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {item.links.map((link: any, lidx: number) => (
                      <a
                        key={lidx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)' }}
                      >
                        <ExternalLink size={16} /> {link.label}
                      </a>
                    ))}
                    <button
                      onClick={() => onSearchInitiate(item.event.split(':')[0])}
                      className="btn-primary"
                      style={{ padding: '8px 20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-emerald)', border: 'none', color: '#000', fontWeight: 600 }}
                    >
                      <Search size={16} /> Initiate Research Protocol
                    </button>
                  </div>
                </div>
              )}
              <div style={{ marginTop: '24px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>Record Type: {item.type}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ChroniclesTimeline;
