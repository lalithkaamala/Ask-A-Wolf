import React from 'react';
import { PawPrint, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabSwitch: (tab: any) => void;
  onToggleSettings: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabSwitch, onToggleSettings }) => {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <PawPrint size={24} className="howl-animation" color="var(--accent-amber)" />
          <h1 className="title-serif" style={{ fontSize: '1.25rem', letterSpacing: '0.5px' }}>
            The American Canid Project
          </h1>
        </div>
        <div className="nav-links">
          <button className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => onTabSwitch('home')}>Overview</button>
          <button className={`nav-link ${activeTab === 'explorer' ? 'active' : ''}`} onClick={() => onTabSwitch('explorer')}>Library</button>
          <button className={`nav-link ${activeTab === 'news' ? 'active' : ''}`} onClick={() => onTabSwitch('news')}>Intelligence</button>
          <button className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => onTabSwitch('history')}>Chronicles</button>
          <button className={`nav-link ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => onTabSwitch('chat')}>Synthesis</button>
          <button className="nav-link" onClick={onToggleSettings}>
            <Settings size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
