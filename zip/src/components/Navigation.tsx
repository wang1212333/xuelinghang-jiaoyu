import { ArrowLeft, Menu, Share, Home, PlusCircle, MessageCircle, User, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TopNavProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}

export function TopNav({ showBack, onBack, title = "墨金学术" }: TopNavProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial theme
    if (document.documentElement.classList.contains('light')) {
      setIsDark(false);
    } else {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.add('light');
      setIsDark(false);
    } else {
      document.documentElement.classList.remove('light');
      setIsDark(true);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 backdrop-blur-xl bg-surface/80 shadow-[0_0_20px_rgba(212,175,55,0.06)]">
      <div className="flex items-center gap-4">
        {showBack ? (
          <button onClick={onBack} className="text-tertiary hover:text-primary transition-colors active:scale-95 duration-200">
            <ArrowLeft size={24} />
          </button>
        ) : (
          <button className="text-primary cursor-pointer active:scale-95 duration-200">
            <Menu size={24} />
          </button>
        )}
        <h1 className="text-xl font-bold tracking-widest font-headline text-primary">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme} 
          className="text-tertiary hover:text-primary transition-colors active:scale-95 duration-200"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        {showBack && <Share size={20} className="text-tertiary cursor-pointer hover:text-primary transition-colors" />}
        <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4faLIxdbj3MICQmbUoGGU9q7LYBYkyPma231DO_sI8TXnXdvkDMno6KaWk-sUt4jpRolR8V5IFxyGzLsPM7Ija6TGWcC8ZQU5YWW-FRLXDd9kexpye-65-DFhDXMuYWD4HEd5Xxrb986YL5LqDEbqw_vt5zywIgqCVM9BNWuG5voKLqXVlQlrAsLNLz01sM3adxqsZepwhVZXKydH12lYi_2brsy97s_d9poAONS0SgAhzNvy9ZTUPrKYi95WmgJe5Kj8NP2uKEjW" 
            alt="User Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}

interface BottomNavProps {
  currentTab: string;
  onChange: (tab: string) => void;
  unreadCount?: number;
}

export function BottomNav({ currentTab, onChange, unreadCount = 0 }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: '首页' },
    { id: 'publish', icon: PlusCircle, label: '发布需求' },
    { id: 'messages', icon: MessageCircle, label: '消息中心' },
    { id: 'profile', icon: User, label: '个人中心' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface/90 backdrop-blur-2xl border-t border-primary-container/15 rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        
        return (
          <div 
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer active:scale-90 duration-300 ease-out relative ${
              isActive ? 'text-primary bg-primary-container/10' : 'text-tertiary hover:bg-surface-container-low'
            }`}
          >
            <div className="relative">
              <Icon size={24} className="mb-1" strokeWidth={isActive ? 2.5 : 2} />
              {tab.id === 'messages' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-error text-on-error text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-surface">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            <span className="text-xs font-sans tracking-tight font-medium">{tab.label}</span>
          </div>
        );
      })}
    </nav>
  );
}
