import { motion } from 'framer-motion';
import CollapseSvg from '~/public/icons/collapse.svg?react';
import ExpandSvg from '~/public/icons/expand.svg?react';
import LogoSvg from '~/public/icons/logo.svg?react';
import MagnifierSvg from '~/public/icons/magnifier.svg?react';
import MenuSvg from '~/public/icons/menu.svg?react';
import PlusSvg from '~/public/icons/plus.svg?react';
import StarSvg from '~/public/icons/star.svg?react';

import { Delimiter } from './Delimiter';
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
          <Stack
            name={<LogoSvg />}
            cover={
              <motion.div whileHover={{ rotate: 90, scale: 1.2 }}>
                <StarSvg className="w-4 h-4" />
              </motion.div>
            }
            cardCount={10}
          />
          <Delimiter />
          <Stack
            name="Stack 2"
            cover={<ExpandSvg className="w-6 h-6" />}
            cardCount={20}
            highlight="1"
          />
          <Stack
            name="Stack 3"
            cover={<CollapseSvg className="w-6 h-6" />}
            cardCount={30}
            highlight="2"
          />
          <Stack
            name="Stack 4"
            cover={<MagnifierSvg className="w-6 h-6" />}
            cardCount={40}
            highlight="3"
          />
          <Stack
            name="Stack 5"
            cover={<MenuSvg className="w-6 h-6" />}
            cardCount={40}
            highlight="4"
          />
          <Stack name="Stack 6" cover={'6'} cardCount={40} highlight="5" />
          <Delimiter />
          <Button className="w-12 h-12" highlight="1">
            <motion.div whileHover={{ rotate: 90, scale: 1.2 }}>
              <PlusSvg className="w-6 h-6" />
            </motion.div>
          </Button>
        </MenuBar>
      </div>
    </div>
  );
}
