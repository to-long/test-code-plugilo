import type React from 'react';
import type { Stack } from '../../../types';

type StackDockItemProps = {
  stack: Stack;
  isActive: boolean;
  isDraggingCard: boolean;
  onSelect: () => void;
  onStackDrop?: () => void;
};

export function StackDockItem({
  stack,
  isActive,
  isDraggingCard,
  onSelect,
  onStackDrop,
}: StackDockItemProps) {
  return (
    <div className="flex flex-col items-center transition-transform duration-300 ease-out hover:scale-110">
      <button
        type="button"
        onClick={onSelect}
        onDragOver={(event: React.DragEvent<HTMLButtonElement>) => {
          if (isDraggingCard) {
            event.preventDefault();
          }
        }}
        onDrop={(event: React.DragEvent<HTMLButtonElement>) => {
          event.preventDefault();
          if (isDraggingCard && onStackDrop) {
            onStackDrop();
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
}
