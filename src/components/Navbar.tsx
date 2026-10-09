import { MessageSquareText } from 'lucide-react';

type NavView = 'home' | 'how-it-works' | 'dashboard' | 'results';

interface NavbarProps {
  onNavigate: (view: NavView) => void;
  currentView: NavView;
}

export function Navbar({ onNavigate, currentView }: NavbarProps) {
  const navItems: { label: string; view: NavView }[] = [
    { label: 'Home', view: 'home' },
    { label: 'How It Works', view: 'how-it-works' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-900/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lavender-400 to-lavender-600 flex items-center justify-center shadow-lg shadow-lavender-500/20 group-hover:shadow-lavender-500/40 transition-shadow">
              <MessageSquareText className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              What Did I Miss?
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === item.view
                    ? 'text-white bg-white/10'
                    : 'text-navy-200 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-lavender-500 text-white hover:bg-lavender-600 transition-all shadow-lg shadow-lavender-500/20 hover:shadow-lavender-500/30 hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
