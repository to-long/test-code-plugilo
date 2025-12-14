import type React from 'react';
import ChevronLeftSvg from '~/public/icons/chevron-left.svg?react';
import ChevronRightSvg from '~/public/icons/chevron-right.svg?react';
import { useDockScroll } from '../hooks/useDockScroll';

type ScrollContainerProps = React.PropsWithChildren<{
  scrollLength: number;
}>;

export function ScrollContainer({ children, scrollLength, ...props }: ScrollContainerProps) {
  const {
    containerRef: stacksContainerRef,
    canScrollLeft,
    canScrollRight,
    needsScrolling,
    scrollLeft,
    scrollRight,
    handleScroll,
    containerMaxWidth,
  } = useDockScroll(scrollLength);

  return (
    <>
      {/* Scroll Left Button */}
      {needsScrolling && (
        <button
          type="button"
          onClick={scrollLeft}
          className={`flex items-center justify-center w-6 h-12 transition-all self-start ${
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
        {children}
      </div>

      {/* Scroll Right Button */}
      {needsScrolling && (
        <button
          type="button"
          onClick={scrollRight}
          className={`flex items-center justify-center w-6 h-12 transition-all self-start ${
            canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll right"
        >
          <ChevronRightSvg className="w-4 h-4" />
        </button>
      )}
    </>
  );
}
