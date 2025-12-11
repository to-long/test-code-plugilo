import { AnimatePresence, motion } from 'framer-motion';

type StackFilterBarProps = {
  isOpen: boolean;
  query: string;
  onQueryChange: (value: string) => void;
};

export function StackFilterBar({ isOpen, query, onQueryChange }: StackFilterBarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="stack-filter"
          className="w-full flex justify-center"
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
        >
          <div className="relative min-w-[260px] max-w-[520px] w-full">
            {/* Glass layers */}
            <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-2xl border border-white/25 shadow-[0_18px_40px_rgba(15,23,42,0.85)]" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/40 via-white/10 to-transparent opacity-90" />

            {/* Content */}
            <div className="relative flex items-center gap-2 px-3 py-1.5 text-sm text-slate-100">
              <svg
                className="w-4 h-4 text-slate-200/80 flex-shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"
                />
              </svg>

              <input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Filter stacks"
                className="flex-1 bg-transparent outline-none placeholder:text-slate-300 text-sm text-slate-50"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => onQueryChange('')}
                  className="text-slate-200 hover:text-white transition-colors"
                  aria-label="Clear filter"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
