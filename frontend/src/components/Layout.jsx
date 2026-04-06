import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  History, 
  Settings, 
  Sun, 
  Moon, 
  Terminal,
  Activity,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui';
import { cn } from './ui';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      'sidebar-link w-full text-left',
      active ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
    )}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const Layout = ({ children, activePage, setActivePage }) => {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Query Analyzer', icon: Search },
    { id: 'history', label: 'Query History', icon: History },
    { id: 'status', label: 'System Status', icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-background transition-colors duration-300">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 glass-card shadow-xl transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-lg">
              <Terminal className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">SQL Performance</h1>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activePage === item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsSidebarOpen(false);
                }}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-border mt-auto">
            <div className="flex items-center justify-between p-4 bg-accent/30 rounded-xl">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Theme</span>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-background shadow-sm">
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/40 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
          <div className="hidden lg:flex items-center space-x-2">
             <span className="text-sm font-medium text-muted-foreground">Pages</span>
             <span className="text-sm text-muted-foreground">/</span>
             <span className="text-sm font-bold text-foreground capitalize">{activePage.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden sm:flex items-center space-x-2 border-primary/20 hover:border-primary/50 transition-all duration-200">
               <Globe className="w-4 h-4" />
               <span>Documentation</span>
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-background">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
