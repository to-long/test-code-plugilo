import type React from 'react';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Stack } from '../types';

interface BottomNavigationProps {
  stacks: Stack[];
  activeStackId: string | null;
  onStackSelect: (stackId: string) => void;
  onCreateClick: () => void;
  onSearchClick: () => void;
  isDraggingCard: boolean;
  onStackDrop?: (stackId: string) => void;
}

export function BottomNavigation({
  stacks,
  activeStackId,
  onStackSelect,
  onCreateClick,
  onSearchClick,
  isDraggingCard,
  onStackDrop,
}: BottomNavigationProps) {

	  const [isCollapsed, setIsCollapsed] = useState(false);
	  const [isSearchOpen, setIsSearchOpen] = useState(false);
	  const [searchQuery, setSearchQuery] = useState('');

	  const visibleStacks = useMemo(
	    () => {
	      const query = searchQuery.trim().toLowerCase();
	      if (!query) return stacks;
	      return stacks.filter((stack) => stack.name.toLowerCase().includes(query));
	    },
	    [stacks, searchQuery],
	  );

	  return (
	    <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center pointer-events-none">
	      <AnimatePresence initial={false} mode="wait">
	        {isCollapsed ? (
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
	              onClick={() => setIsCollapsed(false)}
	              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-slate-200 shadow-xl backdrop-blur-lg hover:bg-white transition-colors duration-200"
	              aria-label="Expand dock"
	              whileHover={{ scale: 1.05, boxShadow: '0 18px 45px rgba(15,23,42,0.45)' }}
	              whileTap={{ scale: 0.96 }}
	            >
	              {/* Brand image / logo placeholder */}
	              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-[10px] font-bold text-white">
	                plug
	              </div>
	              <span className="text-sm font-semibold text-slate-800">
	                plugilo
	              </span>
	              <span className="ml-1 text-slate-500">
	                <ExpandIcon />
	              </span>
	            </motion.button>
	          </motion.div>
	        ) : (
	          <motion.div
	            key="expanded"
	            className="flex flex-col items-center gap-3 pointer-events-auto"
	            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(8px)' }}
	            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
	            exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(8px)' }}
	            transition={{ duration: 0.22, ease: 'easeOut' }}
	          >
	          {/* Search / filter bar */}
	          <AnimatePresence>
	            {isSearchOpen && (
	              <motion.div
	                key="search"
	                className="w-full flex justify-center"
	                initial={{ opacity: 0, y: 12, scale: 0.95 }}
	                animate={{ opacity: 1, y: 0, scale: 1 }}
	                exit={{ opacity: 0, y: 12, scale: 0.95 }}
	                transition={{ duration: 0.16, ease: 'easeOut' }}
	              >
	                <div className="min-w-[260px] max-w-[520px] w-full relative">
	                  <div className="flex items-center gap-2 rounded-full bg-white/95 border border-orange-400 shadow-xl px-3 py-1.5 text-sm text-slate-800">
	                    <svg
	                      className="w-4 h-4 text-slate-500 flex-shrink-0"
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
	                      value={searchQuery}
	                      onChange={(event) => setSearchQuery(event.target.value)}
	                      placeholder="Filter stacks"
	                      className="flex-1 bg-transparent outline-none placeholder:text-slate-400 text-sm"
	                    />
	                    {searchQuery && (
	                      <button
	                        type="button"
	                        onClick={() => setSearchQuery('')}
	                        className="text-slate-400 hover:text-slate-600 transition-colors"
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

	          {/* Dock Container with Liquid Glass Effect */}
	          <div className="relative">
	            {/* Glass Background */}
	            <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl" />

	            {/* Gradient Overlay for Depth */}
	            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl" />

	            {/* Content */}
	            <div className="relative px-4 py-3">
	              <div className="flex items-end gap-3 overflow-visible max-w-full">
	                {/* Brand / favorite section */}
	                <div className="flex items-center gap-2 pr-4 mr-1 border-r border-white/20 flex-shrink-0">
	                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg">
	                    ★
	                  </div>
	                  <span className="text-xs font-semibold text-white/90 tracking-wide">
	                    plugilo
	                  </span>
	                </div>

			        {/* Stack Items - horizontally scrollable */}
			        <div className="flex-1 overflow-x-auto overflow-y-visible">
	                  <div className="flex items-end gap-3 pr-6">
	                    {visibleStacks.map((stack) => {
	                      const isActive = activeStackId === stack.id;

	                      return (
	                        <div
	                          key={stack.id}
	                          className="flex flex-col items-center transition-transform duration-300 ease-out hover:scale-110"
	                        >
	                          <button
	                            onClick={() => onStackSelect(stack.id)}
	                            onDragOver={(e) => {
	                              if (isDraggingCard) {
	                                e.preventDefault();
	                              }
	                            }}
	                            onDrop={(e) => {
	                              e.preventDefault();
	                              if (isDraggingCard && onStackDrop) {
	                                onStackDrop(stack.id);
	                              }
	                            }}
	                            className="relative group"
	                          >
	                            {/* Active Indicator */}
	                            {isActive && (
	                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-lg shadow-white/50" />
	                            )}

	                            {/* Stack Icon Container */}
	                            <div className="relative">
	                              {/* Stack Icon */}
	                              <div
	                                className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl relative"
	                                style={{ background: stack.cover }}
	                              >
	                                {/* Glass Overlay */}
	                                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />

	                                {/* Content */}
	                                <div className="relative w-full h-full flex items-center justify-center text-white font-bold text-lg">
	                                  {stack.name.charAt(0)}
	                                </div>
	                              </div>

			                              {/* Badge - positioned inside the tile to avoid scroll clipping */}
			                              {stack.cardCount > 0 && (
			                                <div className="absolute top-0 right-0 bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center font-bold shadow-lg border-2 border-white/30">
			                                  {stack.cardCount}
			                                </div>
			                              )}
	                            </div>
	                          </button>
	                        </div>
	                      );
	                    })}
	                  </div>
	                </div>

	                {/* Divider */}
	                <div className="w-px h-12 bg-white/20 mx-1 flex-shrink-0" />

	                {/* Create button */}
	                <div className="flex flex-col items-center transition-transform duration-300 ease-out hover:scale-110 flex-shrink-0">
	                  <button
	                    onClick={onCreateClick}
	                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 hover:from-violet-400 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/70 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
	                    aria-label="Create"
	                  >
	                    {/* Glass Overlay */}
	                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />

	                    <svg className="w-7 h-7 relative z-10 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
	                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
	                    </svg>
	                  </button>
	                </div>
	              </div>

	              {/* Small search toggle above the minimize button */}
	              <motion.button
	                type="button"
	                onClick={() => {
	                  setIsSearchOpen((previous) => {
	                    const next = !previous;
	                    if (next) {
	                      onSearchClick();
	                    }
	                    return next;
	                  });
	                }}
	                className="absolute -right-4 top-1 w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 flex items-center justify-center text-white shadow-md"
	                aria-label="Search"
	                whileHover={{ scale: 1.07 }}
	                whileTap={{ scale: 0.94 }}
	              >
	                <svg
	                  className="w-3.5 h-3.5"
	                  viewBox="0 0 24 24"
	                  aria-hidden="true"
	                  fill="none"
	                  stroke="currentColor"
	                >
	                  <path
	                    strokeLinecap="round"
	                    strokeLinejoin="round"
	                    strokeWidth={2}
	                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
	                  />
	                </svg>
	              </motion.button>

	              {/* Minimize / collapse into floating button */}
	              <motion.button
	                type="button"
	                onClick={() => setIsCollapsed(true)}
	                className="absolute -right-4 bottom-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-lg"
	                aria-label="Minimize dock"
	                whileHover={{ scale: 1.1, rotate: 0 }}
	                whileTap={{ scale: 0.9, rotate: 90 }}
	              >
	                <MinimizeIcon className="w-3.5 h-3.5" />
	              </motion.button>
	            </div>
	          </div>
	        </motion.div>
	      )}
	    </AnimatePresence>
	  </div>
	  );
}

type IconProps = React.SVGProps<SVGSVGElement>;

function ExpandIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-4 h-4"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 10V4h6M4 14v6h6M20 10V4h-6M20 14v6h-6"
      />
    </svg>
  );
}

function MinimizeIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 4H4v5M4 15v5h5M20 9V4h-5M15 20h5v-5"
      />
    </svg>
  );
}

