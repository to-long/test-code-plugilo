import {
  Button,
  Delimiter,
  MenuBar,
  RoundButton,
  Stack as StackItem,
} from '@/shared/liquid-glass-components';
import { AnimatePresence, motion } from 'framer-motion';
import type React from 'react';
import { useMemo, useState } from 'react';
import ChevronLeftSvg from '~/public/icons/chevron-left.svg?react';
import ChevronRightSvg from '~/public/icons/chevron-right.svg?react';
import CollapseSvg from '~/public/icons/collapse.svg?react';
import LogoSvg from '~/public/icons/logo.svg?react';
import MagnifierSvg from '~/public/icons/magnifier.svg?react';
import PlusSvg from '~/public/icons/plus.svg?react';
import StarSvg from '~/public/icons/star.svg?react';
import type { Stack } from '@/features/stacks/types';
import { useDockScroll } from '../hooks/useDockScroll';
import { CollapsedDock } from './CollapsedDock';
import { StackFilterBar } from './StackFilterBar';

// Highlight colors to cycle through for stacks
const HIGHLIGHT_COLORS: Array<'1' | '2' | '3' | '4' | '5'> = ['1', '2', '3', '4', '5'];

type DockProps = {
  stacks: Stack[];
  activeStackId: string | null;
  onStackSelect: (stackId: string) => void;
  onCreateClick: () => void;
  onSearchClick: () => void;
  isDraggingCard: boolean;
  hoveredStackId?: string | null;
  onStackDrop?: (stackId: string) => void;
  onCollapse?: () => void;
};

export function Dock({
  stacks,
  activeStackId,
  onStackSelect,
  onCreateClick,
  onSearchClick,
  isDraggingCard,
  hoveredStackId,
  onStackDrop,
  onCollapse,
}: DockProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const visibleStacks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return stacks;
    return stacks.filter((stack) => stack.name.toLowerCase().includes(query));
  }, [stacks, searchQuery]);

  const {
    containerRef: stacksContainerRef,
    canScrollLeft,
    canScrollRight,
    needsScrolling,
    scrollLeft,
    scrollRight,
    handleScroll,
    containerMaxWidth,
  } = useDockScroll(visibleStacks.length);

  const handleStackDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (isDraggingCard) {
      event.preventDefault();
    }
  };

  const handleStackDrop = (event: React.DragEvent<HTMLDivElement>, stackId: string) => {
    event.preventDefault();
    if (isDraggingCard && onStackDrop) {
      onStackDrop(stackId);
    }
  };

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

            {/* Dock Container with MenuBar */}
            <MenuBar className="pe-2 items-end">
              {/* Logo / Brand */}
              <StackItem
                name={<LogoSvg className="w-10" />}
                cover={
                  <motion.div whileHover={{ rotate: 90, scale: 1.2 }}>
                    <StarSvg className="w-4 h-4" />
                  </motion.div>
                }
              />

              <Delimiter />

              {/* Scroll Left Button */}
              {needsScrolling && (
                <button
                  onClick={scrollLeft}
                  className={`flex items-center justify-center w-6 h-12 transition-all self-center ${
                    canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  aria-label="Scroll left"
                >
                  <ChevronLeftSvg className="w-4 h-4" />
                </button>
              )}

              {/* Stack Items Container */}
              <div
                ref={stacksContainerRef}
                className="flex gap-2 overflow-x-auto overflow-y-visible scrollbar-hide py-2 -my-2 px-2 -mx-2"
                style={{
                  maxWidth: containerMaxWidth ?? 'none',
                  minWidth: '200px', // At least enough for 3 stack items (3 × 56px + 2 × 8px gaps + padding)
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
                onScroll={handleScroll}
              >
                {visibleStacks.map((stack, index) => {
                  const isActive = activeStackId === stack.id;
                  const isHovered = hoveredStackId === stack.id;
                  const highlight = HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length];

                  return (
                    <motion.div
                      key={stack.id}
                      data-stack-id={stack.id}
                      onClick={() => onStackSelect(stack.id)}
                      onDragOver={handleStackDragOver}
                      onDrop={(e) => handleStackDrop(e, stack.id)}
                      className="cursor-pointer relative flex-shrink-0"
                      animate={{
                        scale: isHovered ? 1.15 : 1,
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      {/* Glow effect when hovered during drag */}
                      {isHovered && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{
                            boxShadow: '0 0 20px 8px rgba(255, 255, 255, 0.4), 0 0 40px 16px rgba(255, 255, 255, 0.2)',
                            zIndex: -1,
                          }}
                        />
                      )}
                      <StackItem
                        name={stack.name}
                        cover={
                          <span className="text-lg font-bold">{stack.name.charAt(0).toUpperCase()}</span>
                        }
                        cardCount={stack.cardCount}
                        highlight={highlight}
                        active={isActive || isHovered}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Scroll Right Button */}
              {needsScrolling && (
                <button
                  onClick={scrollRight}
                  className={`flex items-center justify-center w-6 h-12 transition-all self-center ${
                    canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  aria-label="Scroll right"
                >
                  <ChevronRightSvg className="w-4 h-4" />
                </button>
              )}

              <Delimiter />

              {/* Create Button - wrapped to align with stacks */}
              <div className="flex flex-col gap-1 items-center w-14">
                <Button className="w-12 h-12" highlight="1" onClick={onCreateClick}>
                  <motion.div whileHover={{ rotate: 90, scale: 1.2 }}>
                    <PlusSvg className="w-6 h-6" />
                  </motion.div>
                </Button>
                <span className="h-[24px]" />
              </div>

              {/* Action Buttons */}
              <div className="w-10 items-end flex gap-1 flex-col ms-auto">
                <RoundButton
                  onClick={() => {
                    setIsSearchOpen((previous) => {
                      const next = !previous;
                      if (next) {
                        onSearchClick();
                      }
                      return next;
                    });
                  }}
                  aria-label="Search"
                >
                  <MagnifierSvg className="w-3 h-3" />
                </RoundButton>
                <RoundButton
                  onClick={() => {
                    setIsCollapsed(true);
                    onCollapse?.();
                  }}
                  aria-label="Minimize dock"
                >
                  <CollapseSvg className="w-3 h-3" />
                </RoundButton>
              </div>
            </MenuBar>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
