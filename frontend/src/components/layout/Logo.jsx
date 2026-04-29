import { motion } from 'framer-motion';

export default function Logo({ size = 'md', className = '' }) {
  const sizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl', xl: 'text-3xl' };
  return (
    <motion.div
      className={`flex items-center gap-2 font-black ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative flex-shrink-0">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-red-glow">
          <span className="text-white font-black text-base leading-none">S</span>
        </div>
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-400 animate-pulse-slow" />
      </div>
      <span>
        <span className="text-white">Sweat</span>
        <span className="text-primary">-Track</span>
      </span>
    </motion.div>
  );
}
