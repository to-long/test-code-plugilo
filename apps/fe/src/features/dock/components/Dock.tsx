import { Logo } from '@/shared/components/Logo';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import CollapseSvg from '~/public/icons/collapse.svg?react';
import type { Stack } from '../../../types';
import { CollapsedDock } from './CollapsedDock';
import { StackDockItem } from './StackDockItem';
import { StackFilterBar } from './StackFilterBar';

type DockProps = {
  stacks: Stack[];
  activeStackId: string | null;
  onStackSelect: (stackId: string) => void;
  onCreateClick: () => void;
  onSearchClick: () => void;
  isDraggingCard: boolean;
  onStackDrop?: (stackId: string) => void;
};

export function Dock({
  stacks,
  activeStackId,
  onStackSelect,
  onCreateClick,
  onSearchClick,
  isDraggingCard,
  onStackDrop,
}: DockProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const visibleStacks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return stacks;
    return stacks.filter((stack) => stack.name.toLowerCase().includes(query));
  }, [stacks, searchQuery]);

  return (
    <div className="fixed inset-x-0 bottom-5 z-40 flex justify-center pointer-events-none">
      <AnimatePresence initial={false} mode="wait">
        {isCollapsed ? (
          <CollapsedDock expandDock={() => setIsCollapsed(false)} stacksCount={stacks.length} />
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
            <StackFilterBar
              isOpen={isSearchOpen}
              query={searchQuery}
              onQueryChange={(value) => setSearchQuery(value)}
            />

            {/* Dock Container with Liquid Glass Effect */}
            <div className="relative">
              {/* Glass Background */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl" />

              {/* Gradient Overlay for Depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl" />

              {/* Content */}
              <div className="relative px-4 py-3">
                <div className="flex items-center gap-3 overflow-visible max-w-full">
                  {/* Brand / favorite section */}
                  <div className="flex items-center gap-2 pr-4 mr-1 border-r border-white/20 flex-shrink-0">
                    <Logo />
                  </div>

                  {/* Stack Items - horizontally scrollable */}
                  <div className="flex-1 overflow-x-auto overflow-y-visible">
                    <div className="flex items-end gap-3 pr-6">
                      {visibleStacks.map((stack) => {
                        const isActive = activeStackId === stack.id;

                        return (
                          <StackDockItem
                            key={stack.id}
                            stack={stack}
                            isActive={isActive}
                            isDraggingCard={isDraggingCard}
                            onSelect={() => onStackSelect(stack.id)}
                            onStackDrop={
                              onStackDrop
                                ? () => {
                                    onStackDrop(stack.id);
                                  }
                                : undefined
                            }
                          />
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

                      <svg
                        className="w-7 h-7 relative z-10 transition-transform group-hover:rotate-90 duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M12 4v16m8-8H4"
                        />
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
                  <CollapseSvg className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
