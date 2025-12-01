import React from 'react';
import useAppStore from '../store/appStore';
import { Home, Globe, FileText, Layout, Image } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { currentView, setCurrentView, reset } = useAppStore();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'templates', label: 'Templates', icon: Layout },
    { id: 'topic', label: 'Topic Research', icon: Globe },
    { id: 'manual', label: 'Manual Input', icon: FileText },
  ];

  return (
    <aside className="sidebar glass-card">
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <button className="btn btn-secondary btn-sm" onClick={reset}>
          Start Over
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
