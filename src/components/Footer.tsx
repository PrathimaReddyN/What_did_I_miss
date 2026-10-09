import { MessageSquareText, Heart } from 'lucide-react';

type FooterView = 'home' | 'how-it-works' | 'dashboard';

interface FooterProps {
  onNavigate: (view: FooterView) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-navy-950 border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lavender-400 to-lavender-600 flex items-center justify-center">
                <MessageSquareText className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold">What Did I Miss?</span>
            </div>
            <p className="text-navy-300 text-sm leading-relaxed max-w-xs">
              Catch up in seconds. Never miss what matters in your conversations.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="text-navy-300 hover:text-lavender-300 text-sm transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-navy-300 hover:text-lavender-300 text-sm transition-colors"
                >
                  About
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button className="text-navy-300 hover:text-lavender-300 text-sm transition-colors">
                  Privacy
                </button>
              </li>
              <li>
                <button className="text-navy-300 hover:text-lavender-300 text-sm transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-navy-400 text-xs">
            (c) 2026 What Did I Miss? All rights reserved.
          </p>
          <p className="text-navy-400 text-xs flex items-center gap-1.5">
            Built with <Heart className="w-3 h-3 text-lavender-400" /> for busy people
          </p>
        </div>
      </div>
    </footer>
  );
}
