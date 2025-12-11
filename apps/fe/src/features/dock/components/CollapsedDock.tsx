import { motion } from 'framer-motion';
import ExpandSvg from '~/public/icons/expand.svg?react';
import LogoSvg from '~/public/icons/logo.svg?react';

type CollapsedDockProps = {
  expandDock: () => void;
};

export const CollapsedDock = ({ expandDock }: CollapsedDockProps) => {
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
        className="flex items-center gap-2 ps-2 py-1 rounded-full bg-gray/95 border border-slate-200 shadow-xl backdrop-blur-lg hover:bg-gray transition-colors duration-200 text-gray-400"
        aria-label="Expand dock"
        whileTap={{ scale: 0.96 }}
      >
        <LogoSvg className="w-16" />
        <span className="w-48 text-left">| 6 stacks</span>
        <div className="flex items-center justify-center rounded-full w-6 h-6 hover:bg-slate-200/10 duration-200">
          <ExpandSvg className="w-3" />
        </div>
      </motion.button>
    </motion.div>
  );
};
