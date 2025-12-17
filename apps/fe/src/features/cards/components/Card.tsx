import { RoundButton } from '@/shared';
import PencilSvg from '~/public/icons/pencil.svg?react';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  image: string;
  name: React.ReactNode;
  description: React.ReactNode;
};

export function Card({
  className = '',
  image,
  name,
  description,
  ...props
}: React.PropsWithChildren<CardProps>) {
  return (
    <div
      className={`
        flex flex-col bg-black/20 backdrop-blur-lg border border-white/50 shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] px-2 py-3 text-white relative rounded-xl before:rounded-xl after:rounded-xl 
        hover:bg-black/10 transition-all duration-300 w-[250px]
        
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none 
        
        after:absolute after:inset-0 after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none
      
        
      ${className}`}
      {...props}
    >
      <img
        src={image}
        alt={name as string}
        className="w-full h-full object-cover aspect-square rounded-lg rounded-b-none"
      />
      <div className="flex flex-col gap-2 p-3 bg-white rounded-lg rounded-t-none">
        <div className="flex gap-1">
          <h3 className="text-lg font-bold text-gray-900">{name}</h3>
          <RoundButton className="ms-auto" aria-label="Edit card">
            <PencilSvg className="w-4 h-4 text-white" aria-hidden="true" />
          </RoundButton>
        </div>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}
