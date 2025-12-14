import type { Card } from '../types';
import PencilSvg from '~/public/icons/pencil.svg?react';
import { RoundButton } from '@/shared/liquid-glass-components/RoundButton';

interface CardItemProps {
  card: Card;
  onEdit: () => void;
  onDelete: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export function CardItem({ card, onEdit, onDelete, style, className = '' }: CardItemProps) {
  return (
    <div
      className={`
        flex flex-col bg-black/20 backdrop-blur-lg border border-white/50 shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] p-2 text-white relative rounded-2xl before:rounded-2xl after:rounded-2xl
        hover:bg-black/10 transition-all duration-300 w-[226px] h-[359px] will-change-transform select-none

        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none

        after:absolute after:inset-0 after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none
      ${className}`}
      style={style}
    >
      <img
        src={card.cover}
        alt={card.name}
        className="w-full h-[250px] object-cover rounded-xl rounded-b-none pointer-events-none select-none"
        draggable={false}
      />
      <div className="flex flex-col gap-1 p-3 bg-white rounded-xl rounded-t-none flex-1 pointer-events-none">
        <div className="flex gap-2 items-center">
          <h3 className="text-base font-bold text-gray-900 flex-1 truncate">{card.name}</h3>
          <RoundButton className="flex-shrink-0 pointer-events-auto" onClick={onEdit}>
            <PencilSvg className="w-4 h-4 text-white" />
          </RoundButton>
        </div>
        {card.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{card.description}</p>
        )}
      </div>
    </div>
  );
}

