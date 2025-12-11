import LogoSvg from '~/public/icons/logo.svg?react';
import StarSvg from '~/public/icons/star.svg?react';
import { CtaButton } from './CtaButton';

type LogoProps = {
  className?: string;
};
export function Logo({ className }: LogoProps) {
  return (
    <div className={`flex items-center flex-col gap-2 ${className}`}>
      <CtaButton className="w-8 h-8">
        <StarSvg className="w-3" />
      </CtaButton>
      <div className="w-100%" style={{ color: '#f3f3f7' }}>
        <div className="w-12 mt-1" style={{ color: '#f3f3f7' }}>
          <LogoSvg />
        </div>
      </div>
    </div>
  );
}
