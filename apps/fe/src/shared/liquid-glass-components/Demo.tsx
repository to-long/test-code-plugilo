import CollapseSvg from '~/public/icons/collapse.svg?react';
import ExpandSvg from '~/public/icons/expand.svg?react';
import StarSvg from '~/public/icons/star.svg?react';
import { MenuBar } from './MenuBar';
import { Stack } from './Stack';
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
        <MenuBar>
          <Stack name="Stack 1" cover="red" icon={<StarSvg className="w-6 h-6" />} cardCount={10} />
          <Stack
            name="Stack 2"
            cover="blue"
            icon={<ExpandSvg className="w-6 h-6" />}
            cardCount={20}
          />
          <Stack
            name="Stack 3"
            cover="green"
            icon={<CollapseSvg className="w-6 h-6" />}
            cardCount={30}
          />
        </MenuBar>
      </div>
    </div>
  );
}
