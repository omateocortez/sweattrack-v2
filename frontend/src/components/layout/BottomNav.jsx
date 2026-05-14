import { NavLink } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import { Home, Activity, BarChart3, Settings, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const NAV = [
  { to: '/dashboard',  label: 'Início',    icon: Home },
  { to: '/monitor',    label: 'Monitor',   icon: Activity },
  { to: '/analytics',  label: 'Análises',  icon: BarChart3 },
  { to: '/settings',   label: 'Config.',   icon: Settings },
  { to: '/profile',    label: 'Perfil',    icon: User },
];

export default function BottomNav() {
  const { dark } = useTheme();
  const inactiveColor = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden">
      {/* Glass bar */}
      <div className="bg-surface-1/90 backdrop-blur-2xl border-t border-border safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          <LayoutGroup id="bottom-nav">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className="flex-1">
                {({ isActive }) => (
                  <motion.div
                    className="nav-link gap-1.5 py-1"
                    whileTap={{ scale: 0.9 }}
                    animate={{ color: isActive ? '#C41E3A' : inactiveColor }}
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
                        color={isActive ? '#C41E3A' : inactiveColor}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-primary' : ''}`}
                    >
                      {label}
                    </span>
                  </motion.div>
                )}
              </NavLink>
            ))}
          </LayoutGroup>
        </div>
      </div>
    </nav>
  );
}
