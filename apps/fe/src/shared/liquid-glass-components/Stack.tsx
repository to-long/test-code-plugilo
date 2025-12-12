import { Button } from './button';

type StackProps = {
  name: string;
  cover: string;
  icon: React.ReactNode;
  cardCount: number;
};

export function Stack({ name, cover, icon, cardCount }: StackProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button className="w-12 h-12">{icon}</Button>
      <span className="text-xs text-white">{name}</span>
    </div>
  );
}
