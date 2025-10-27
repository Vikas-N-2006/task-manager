import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tasks from './pages/tasks';
import AuditLogs from './components/AuditLogs';
import { TaskIcon, AuditIcon } from './components/Icon';

function App() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'tasks', label: 'Task Manager', icon: TaskIcon },
    { id: 'audit-logs', label: 'Audit Logs', icon: AuditIcon }
  ];

  return (
    <div className="app">
      {/* Modern Sidebar */}
      <motion.div 
        className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <TaskIcon size={18} />
            </div>
            <span className="brand-text">TaskFlow</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  <IconComponent className="nav-icon" />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="main-content">
        {/* Mobile Header */}
        <div className="mobile-header" style={{ display: 'none' }}>
          <button 
            className="btn btn-ghost btn-icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'tasks' && <Tasks />}
            {activeTab === 'audit-logs' && <AuditLogs />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
        />
      )}
    </div>
  );
}

export default App;