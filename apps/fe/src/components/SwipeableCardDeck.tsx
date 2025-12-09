import { useDrag } from '@use-gesture/react';
import { useState } from 'react';
import type { Card } from '../types';
import { CardItem } from './CardItem';

interface SwipeableCardDeckProps {
  cards: Card[];
  onEdit: (card: Card) => void;
  onDelete: (cardId: string) => void;
  onMove: (cardId: string, targetStackId: string) => void;
  stacks: Array<{ id: string; name: string }>;
  isDraggingToStacks: boolean;
  onDragStart: (cardId: string) => void;
  onDragEnd: () => void;
}

export function SwipeableCardDeck({
  cards,
  onEdit,
  onDelete,
  onMove,
  stacks,
  isDraggingToStacks,
  onDragStart,
  onDragEnd,
}: SwipeableCardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteZone, setShowDeleteZone] = useState(false);

  const currentCard = cards[currentIndex];

  const bind = useDrag(
    ({ down, movement: [mx, my], velocity: [vx], direction: [dx] }) => {
      setIsDragging(down);

      if (down) {
        setDragOffset({ x: mx, y: my });

        // Show delete zone when dragging up
        if (my < -50) {
          setShowDeleteZone(true);
          if (currentCard) onDragStart(currentCard.id);
        } else if (my > 50) {
          // Show stack selector when dragging down
          if (currentCard) onDragStart(currentCard.id);
        } else {
          setShowDeleteZone(false);
          onDragEnd();
        }
      } else {
        // Handle swipe actions
        if (my < -150) {
          // Dragged up - delete
          if (currentCard) {
            onDelete(currentCard.id);
            setCurrentIndex((i) => Math.min(i, cards.length - 2));
          }
        } else if (Math.abs(mx) > 150 || (Math.abs(vx) > 0.5 && Math.abs(dx) > 0)) {
          // Swiped left or right - next/previous card
          if (dx > 0 && currentIndex > 0) {
            setCurrentIndex((i) => i - 1);
          } else if (dx < 0 && currentIndex < cards.length - 1) {
            setCurrentIndex((i) => i + 1);
          }
        }

        setDragOffset({ x: 0, y: 0 });
        setShowDeleteZone(false);
        onDragEnd();
      }
    },
    {
      axis: undefined,
      filterTaps: true,
      pointer: { touch: true },
      rubberband: true,
    }
  );

  if (!currentCard) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-400">
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-xl">No cards in this stack</p>
        </div>
      </div>
    );
  }

  const transform = `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${dragOffset.x * 0.05}deg)`;
  const opacity = 1 - Math.abs(dragOffset.x) / 500;

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Delete Zone */}
      {showDeleteZone && (
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-red-500 text-white p-4 rounded-full shadow-2xl">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        </div>
      )}

      {/* Card Stack Preview */}
      <div className="relative h-[600px] w-full max-w-sm mx-auto">
        {/* Background cards - stacked with rotation effect */}
        {cards.slice(currentIndex + 1, currentIndex + 4).map((card, i) => {
          const stackIndex = i + 1;
          const rotationDeg = stackIndex * 2; // Reduced rotation to 2 degrees
          const translateX = stackIndex * 20; // Offset to the right
          const translateY = stackIndex * 5; // Slight downward offset

          return (
            <div
              key={card.id}
              className="absolute top-0 left-0 w-full pointer-events-none will-change-transform"
              style={{
                transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotationDeg}deg)`,
                transformOrigin: 'bottom left',
                zIndex: 10 - stackIndex,
              }}
            >
              <CardItem card={card} onEdit={() => {}} onDelete={() => {}} />
            </div>
          );
        })}

        {/* Current card */}
        <div
          {...bind()}
          className="absolute top-0 left-0 w-full cursor-grab active:cursor-grabbing touch-none will-change-transform"
          style={{
            transform,
            opacity,
            transformOrigin: 'bottom left',
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 20,
          }}
        >
          <CardItem
            card={currentCard}
            onEdit={() => onEdit(currentCard)}
            onDelete={() => onDelete(currentCard.id)}
          />
        </div>
      </div>

      {/* Card Counter */}
      <div className="text-center mt-4 text-gray-400">
        {currentIndex + 1} / {cards.length}
      </div>
    </div>
  );
}

