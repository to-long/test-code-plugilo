import ExpandSvg from '~/public/icons/expand.svg?react';
import LogoSvg from '~/public/icons/logo.svg?react';
import { Delimiter } from './Delimiter';
import { MenuBar } from './MenuBar';
import { RoundButton } from './RoundButton';

type CollapsedDockProps = {
  expandDock: () => void;
  stacksCount: number;
};

export const CollapsedDock = ({ expandDock, stacksCount }: CollapsedDockProps) => {
  const label = `${stacksCount} stack${stacksCount === 1 ? '' : 's'}`;

  return (
    <MenuBar className="w-60 h-8 p-0 ps-2 items-center">
      <LogoSvg className="w-14 drop-shadow-[0_6px_18px_rgba(15,23,42,0.9)]" />
      <Delimiter className="h-[50%]" />
      <span className="w-32 text-left text-xs text-slate-100/80 truncate">{label}</span>

      <RoundButton className="ms-auto flex-shrink-0">
        <ExpandSvg className="w-3 h-3 " />
      </RoundButton>
    </MenuBar>
  );
};
