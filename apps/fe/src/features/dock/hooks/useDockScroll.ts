import { useCallback, useEffect, useRef, useState } from 'react';

// Maximum number of visible stacks before enabling scroll
const MAX_VISIBLE_STACKS = 5;
// Approximate width of each stack item (including gap)
const STACK_ITEM_WIDTH = 72;

interface UseDockScrollOptions {
  /** Number of items to scroll per action (default: 2) */
  scrollMultiplier?: number;
  /** Delay in ms before updating scroll buttons after content change (default: 100) */
  updateDelay?: number;
}

interface UseDockScrollReturn {
  /** Ref to attach to the scrollable container */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Whether the container can scroll left */
  canScrollLeft: boolean;
  /** Whether the container can scroll right */
  canScrollRight: boolean;
  /** Whether scrolling is needed (more items than visible) */
  needsScrolling: boolean;
  /** Scroll the container left */
  scrollLeft: () => void;
  /** Scroll the container right */
  scrollRight: () => void;
  /** Handler for scroll events - attach to onScroll */
  handleScroll: () => void;
  /** Maximum width for the container when scrolling is needed */
  containerMaxWidth: string | undefined;
}

/**
 * Hook for managing horizontal scroll behavior in the dock's stack container.
 * Handles scroll button visibility, scroll actions, and container width calculation.
 */
export function useDockScroll(
  itemCount: number,
  options: UseDockScrollOptions = {},
): UseDockScrollReturn {
  const { scrollMultiplier = 2, updateDelay = 100 } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const needsScrolling = itemCount > MAX_VISIBLE_STACKS;

  const updateScrollButtons = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  const scrollLeft = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({
      left: -STACK_ITEM_WIDTH * scrollMultiplier,
      behavior: 'smooth',
    });
  }, [scrollMultiplier]);

  const scrollRight = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({
      left: STACK_ITEM_WIDTH * scrollMultiplier,
      behavior: 'smooth',
    });
  }, [scrollMultiplier]);

  // Initialize scroll button states when item count changes
  useEffect(() => {
    if (!needsScrolling) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    // Small delay to ensure DOM has updated
    const timer = setTimeout(updateScrollButtons, updateDelay);
    return () => clearTimeout(timer);
  }, [itemCount, needsScrolling, updateDelay, updateScrollButtons]);

  const containerMaxWidth = needsScrolling
    ? `${MAX_VISIBLE_STACKS * STACK_ITEM_WIDTH + 16}px`
    : undefined;

  return {
    containerRef,
    canScrollLeft,
    canScrollRight,
    needsScrolling,
    scrollLeft,
    scrollRight,
    handleScroll: updateScrollButtons,
    containerMaxWidth,
  };
}
