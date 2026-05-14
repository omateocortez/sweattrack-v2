import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from './Logo';
import NotificationPopup from '../ui/NotificationPopup';

export default function Header({ title, showBack = false, actions }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-surface-0/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left */}
        <div className="flex items-center gap-2">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          ) : (
            <div className="md:hidden">
              <Logo size="sm" />
            </div>
          )}
          {title && (
            <h1 className={`font-bold ${showBack ? 'text-base' : 'text-sm text-white/60'}`}>
              {title}
            </h1>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {actions}
          <NotificationPopup />
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
