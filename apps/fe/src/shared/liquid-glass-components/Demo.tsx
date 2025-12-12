import { CollapsedDock } from './CollapsedDock';
import { Dock } from './Dock';
import { Search } from './Search';
import { Button } from './button';

export function Demo() {
  return (
    <div className="p-4 gap-4 flex flex-wrap">
      <div className="w-full gap-4 flex ">
        <Button>Button</Button>
        <Button highlight="1">Button 2</Button>
        <Button highlight="2">Button 3</Button>
        <Button highlight="3">Button 4</Button>
        <Button highlight="4">Button 5</Button>
        <Button highlight="5">Button 6</Button>
      </div>
      <div className="w-full">
        <Search />
      </div>
      <div className="w-full">
        <Dock />
      </div>
      <div className="w-full">
        <CollapsedDock expandDock={() => {}} stacksCount={3} />
      </div>
    </div>
  );
}
