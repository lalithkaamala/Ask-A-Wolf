import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Plus, Search, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

interface LibraryExplorerProps {
  papers: any[];
  loadingPapers: boolean;
  totalPapersCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e?: React.FormEvent) => void;
  onShowContribute: () => void;
}

export const LibraryExplorer: React.FC<LibraryExplorerProps> = ({
  papers,
  loadingPapers,
  totalPapersCount,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onShowContribute
}) => {
  return (
    <motion.div
      key="explorer"
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
    >
      {/* Research Evolution Data Visualization */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '48px', borderLeft: '4px solid var(--accent-amber)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <TrendingUp className="text-amber-500" size={24} color="var(--accent-amber)" />
          <h3 className="title-serif" style={{ fontSize: '1.5rem' }}>Research Evolution Protocol</h3>
        </div>
        
        <div style={{ height: '200px', width: '100%', position: 'relative' }}>
          {loadingPapers && papers.length === 0 ? (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <Activity size={16} className="holographic-pulse" style={{ marginRight: '8px' }} /> Synchronizing Temporal Metadata...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={(() => {
                const yearCounts: Record<number, number> = {};
                papers.forEach(p => {
                  if (p.year && p.year >= 1990) {
                    yearCounts[p.year] = (yearCounts[p.year] || 0) + 1;
                  }
                });
                return Object.entries(yearCounts)
                  .map(([year, count]) => ({ year, count }))
                  .sort((a, b) => Number(a.year) - Number(b.year));
              })()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="year" hide />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--accent-amber)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {papers.length > 0 && Array.from({ length: 40 }).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`rgba(245, 158, 11, ${0.4 + (index * 0.015)})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>1990 — Historical Baseline</span>
          <span>Active Expansion Pulse</span>
          <span>2026 — Intelligence Horizon</span>
        </div>
      </div>

      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 className="title-serif" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Research Library</h2>
          <p style={{ color: 'var(--text-muted)' }}>Searching an archive of {totalPapersCount} open-access publications</p>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button className="btn-secondary" onClick={onShowContribute} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}>
            <Plus size={18} /> Contribute
          </button>
          <form onSubmit={onSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search species, behaviors..."
                style={{ paddingLeft: '48px', width: '300px' }}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loadingPapers}>Search</button>
          </form>
        </div>
      </div>

      {loadingPapers ? (
        <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'inline-block', marginBottom: '16px' }}>
            <Search size={32} />
          </motion.div>
          <p>Aggregating research data...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {papers.map((paper, idx) => (
            <motion.div key={paper.paperId || idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', marginBottom: '8px', fontWeight: 600 }}>{paper.venue || 'Journal Unknown'} • {paper.year || 'N/A'}</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', lineHeight: 1.4, color: 'var(--text-primary)' }}>{paper.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {paper.abstract || 'No abstract available for this paper.'}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{paper.authors?.slice(0, 2).map((a: any) => a.name).join(', ')}{paper.authors?.length > 2 ? ' et al.' : ''}</span>
                {paper.url && (
                  <a href={paper.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                    Source <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
          {papers.length === 0 && <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', padding: '64px' }}>No papers found.</p>}
        </div>
      )}
    </motion.div>
  );
};

export default LibraryExplorer;
