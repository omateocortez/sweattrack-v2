import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Activity, BarChart3, User } from 'lucide-react';

const NAV = [
  { to: '/dashboard',  label: 'Início',     icon: Home },
  { to: '/monitor',    label: 'Monitorar',  icon: Activity },
  { to: '/analytics',  label: 'Análises',   icon: BarChart3 },
  { to: '/profile',    label: 'Perfil',     icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden">
      {/* Glass bar */}
      <div className="bg-surface-1/90 backdrop-blur-2xl border-t border-border safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className="flex-1">
              {({ isActive }) => (
                <motion.div
                  className="nav-link py-1"
                  whileTap={{ scale: 0.9 }}
                  animate={{ color: isActive ? '#C41E3A' : 'rgba(255,255,255,0.4)' }}
                >
                  <div className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute -inset-2 bg-primary/15 rounded-xl"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon
                      size={20}
                      className="relative z-10"
                      strokeWidth={isActive ? 2.5 : 1.8}
                      color={isActive ? '#C41E3A' : 'rgba(255,255,255,0.4)'}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-primary' : 'text-white/40'}`}
                  >
                    {label}
                  </span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
