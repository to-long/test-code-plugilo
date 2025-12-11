import { CtaButton } from '@/shared/components';
import { motion } from 'framer-motion';
import ExpandSvg from '~/public/icons/expand.svg?react';
import LogoSvg from '~/public/icons/logo.svg?react';

type CollapsedDockProps = {
  expandDock: () => void;
  stacksCount: number;
};

export const CollapsedDock = ({ expandDock, stacksCount }: CollapsedDockProps) => {
  const label = `${stacksCount} stack${stacksCount === 1 ? '' : 's'}`;

  return (
    <motion.div
      key="collapsed"
      className="pointer-events-auto"
      initial={{ opacity: 0, y: 24, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.85 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <motion.button
        type="button"
        onClick={expandDock}
        className="relative flex items-center gap-2 ps-3 pe-2 py-1.5 rounded-full text-slate-50 shadow-[0_18px_40px_rgba(15,23,42,0.85)] backdrop-blur-2xl border border-white/25 overflow-hidden group"
        aria-label="Expand dock"
        whileTap={{ scale: 0.96 }}
      >
        {/* Base glass layer */}
        <div className="absolute inset-0 bg-white/10" />

        {/* Highlight sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-white/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Inner pill border */}
        <div className="absolute inset-[1px] rounded-full border border-white/25" />

        {/* Content */}
        <div className="relative flex items-center gap-2">
          <LogoSvg className="w-16 drop-shadow-[0_6px_18px_rgba(15,23,42,0.9)]" />

          <span className="w-32 text-left text-xs text-slate-100/80 truncate">| {label}</span>

          <CtaButton className="w-6 h-6">
            <ExpandSvg className="w-3" />
          </CtaButton>
        </div>
      </motion.button>
    </motion.div>
  );
};
