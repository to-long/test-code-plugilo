import { Button, type ButtonProps } from './button';

type StackProps = {
  name: React.ReactNode;
  cover?: React.ReactNode;
  cardCount: number;
} & Pick<ButtonProps, 'highlight'>;

export function Stack({ name, cover, cardCount, highlight }: StackProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button className="w-12 h-12" highlight={highlight}>
        {cover || name}
      </Button>
      <span className="text-xs text-white">{name}</span>
    </div>
  );
}
