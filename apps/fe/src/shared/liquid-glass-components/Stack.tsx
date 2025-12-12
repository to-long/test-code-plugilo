import { Button, type ButtonProps } from './button';

type StackProps = {
  name: React.ReactNode;
  cover?: React.ReactNode;
  cardCount?: number;
  active?: boolean;
} & Pick<ButtonProps, 'highlight'>;

export function Stack({ name, cover, cardCount = 0, highlight, active }: StackProps) {
  return (
    <div className="flex flex-col gap-2 relative">
      <Button className="w-12 h-12" highlight={highlight}>
        {cover || name}
      </Button>
      <span className="text-xs text-white">{name}</span>
      {cardCount > 0 && (
        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-red-500 to-pink-600 text-white text-[9px] rounded-full min-w-[20px] h-4 px-1 flex items-center justify-center font-bold shadow-lg border-1 border-white/30">
          {cardCount > 9 ? '9+' : cardCount}
        </div>
      )}
      {active && (
        <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
      )}
    </div>
  );
}
