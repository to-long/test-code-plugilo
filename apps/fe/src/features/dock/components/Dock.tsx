import { StackItem } from '@/features/stacks/components';
import type { Stack } from '@/features/stacks/types';
import { Button, Delimiter, RoundButton } from '@/shared';
import { AnimatePresence, motion } from 'framer-motion';
import type React from 'react';
import { useMemo, useState } from 'react';
import CollapseSvg from '~/public/icons/collapse.svg?react';
import LogoSvg from '~/public/icons/logo.svg?react';
import MagnifierSvg from '~/public/icons/magnifier.svg?react';
import PlusSvg from '~/public/icons/plus.svg?react';
import StarSvg from '~/public/icons/star.svg?react';
import { CollapsedDock } from './CollapsedDock';
import { MemoizedHorizontalScroller } from './HorizontalScroller';
import { MenuBar } from './MenuBar';
import { StackSearch } from './StackSearch';

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

  const handleStackDragOver = (event: React.DragEvent<HTMLElement>) => {
    if (isDraggingCard) {
      event.preventDefault();
    }
  };

  const handleStackDrop = (event: React.DragEvent<HTMLElement>, stackId: string) => {
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
            className="flex flex-col items-center gap-3 pointer-events-auto w-fit px-2 max-w-full"
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(8px)' }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {/* Search / filter bar */}
            <StackSearch
              isOpen={isSearchOpen}
              query={searchQuery}
              onQueryChange={(value) => setSearchQuery(value)}
            />

            {/* Dock Container with MenuBar */}
            <nav aria-label="Main navigation dock">
              <MenuBar className="p-3 pe-1 items-end w-full">
                {/* Logo / Brand */}
                <StackItem
                  name={<LogoSvg className="w-10" aria-label="Plugilo logo" />}
                  cover={
                    <motion.div whileHover={{ rotate: 90, scale: 1.2 }}>
                      <StarSvg className="w-4 h-4" aria-hidden="true" />
                    </motion.div>
                  }
                  aria-label="Plugilo home"
                />

                <Delimiter />

                <MemoizedHorizontalScroller>
                  {visibleStacks.map((stack, index) => {
                    const isActive = activeStackId === stack.id;
                    const isHovered = hoveredStackId === stack.id;
                    const highlight = HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length];

                    return (
                      <motion.button
                        type="button"
                        key={stack.id}
                        data-stack-id={stack.id}
                        onClick={() => onStackSelect(stack.id)}
                        onDragOver={handleStackDragOver}
                        onDrop={(e) => handleStackDrop(e, stack.id)}
                        className="cursor-pointer relative flex-shrink-0 bg-transparent border-none p-0"
                        aria-label={`${stack.name} stack${stack.cardCount ? `, ${stack.cardCount} card${stack.cardCount === 1 ? '' : 's'}` : ''}${isActive ? ', selected' : ''}`}
                        aria-pressed={isActive}
                      >
                        <StackItem
                          name={stack.name}
                          cover={
                            <span className="text-lg font-bold" aria-hidden="true">
                              {stack.name.charAt(0).toUpperCase()}
                            </span>
                          }
                          cardCount={stack.cardCount}
                          highlight={highlight}
                          active={isActive}
                          hovered={isHovered}
                        />
                      </motion.button>
                    );
                  })}
                </MemoizedHorizontalScroller>

                <Delimiter className="ms-auto" />

                {/* Create Button - wrapped to align with stacks */}
                <div className="flex flex-col gap-1 items-center w-14">
                  <Button
                    className="w-12 h-12"
                    highlight="1"
                    onClick={onCreateClick}
                    aria-label="Create new card or stack"
                  >
                    <motion.div whileHover={{ rotate: 90, scale: 1.2 }}>
                      <PlusSvg className="w-6 h-6" aria-hidden="true" />
                    </motion.div>
                  </Button>
                  <span className="h-[24px]" aria-hidden="true" />
                </div>

                {/* Action Buttons */}
                <div className="items-end flex gap-1 self-start flex-col">
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
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
