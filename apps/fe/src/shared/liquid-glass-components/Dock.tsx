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
import { RoundButton } from './RoundButton';
import { Stack } from './Stack';
import { Button } from './button';

export function Dock() {
  return (
    <MenuBar className="w-[550px] pe-2">
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
      <Stack name="Stack 5" cover={<MenuSvg className="w-6 h-6" />} cardCount={40} highlight="4" />
      <Stack name="Stack 6" cover={'6'} cardCount={40} highlight="5" />
      <Delimiter />
      <Button className="w-12 h-12" highlight="1">
        <motion.div whileHover={{ rotate: 90, scale: 1.2 }}>
          <PlusSvg className="w-6 h-6" />
        </motion.div>
      </Button>
      <div className="w-10 items-end flex gap-2 flex-col ms-auto">
        <RoundButton>
          <MagnifierSvg className="w-3.5 h-3.5" />
        </RoundButton>
        <RoundButton>
          <CollapseSvg className="w-3.5 h-3.5" />
        </RoundButton>
      </div>
    </MenuBar>
  );
}
