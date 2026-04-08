import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { ThreeDMap } from './ThreeDMap';

interface IntelligenceDeskProps {
  news: any[];
}

export const IntelligenceDesk: React.FC<IntelligenceDeskProps> = ({ news }) => {
  return (
    <motion.div
      key="news" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
    >
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="title-serif" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Intelligence Desk</h2>
          <p style={{ color: 'var(--text-muted)' }}>Real-time updates and recent developments in Canid conservation and science.</p>
        </div>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <Globe size={16} color="var(--accent-emerald)" className="holographic-pulse" />
          <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Sentinel Orbital Active</span>
        </div>
      </div>

      {/* 3D Interactive Range Analysis Hub */}
      <div className="glass-panel glow-border sentinel-scan" style={{ padding: '32px', marginBottom: '48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h3 className="title-serif" style={{ fontSize: '1.25rem', color: 'var(--accent-blue)' }}>Predictive Distribution Matrix [3D]</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Simulated range expansion based on 2025-2026 climate and prey density data.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--accent-amber)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-amber)' }}></div> Establish
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--accent-blue)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-blue)' }}></div> Dispersal Corridor
            </div>
          </div>
        </div>

        <ThreeDMap />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {news.map((item, idx) => (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: idx * 0.1 }} 
            className="glass-panel sentinel-scan glow-border" 
            style={{ padding: '24px', display: 'flex', gap: '24px', overflow: 'hidden' }}
          >
            <div style={{ minWidth: '100px', textAlign: 'center', borderRight: '1px solid var(--border-color)', paddingRight: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{item.category}</div>
              <div className="holographic-pulse" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-blue)' }}>{item.date.split('-')[2]}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{new Date(item.date).toLocaleString('default', { month: 'short' })}</div>
            </div>
            <div>
              <h3 className="title-serif" style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>{item.summary}</p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-blue)', opacity: 0.5 }}></div>
                Source: {item.source}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default IntelligenceDesk;
