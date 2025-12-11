import Star from '~/public/icons/star.svg?react';
import { RotateIcon } from './RotateIcon';
import { ZoomIcon } from './ZoomIcon';

export function StarIcon() {
  return (
    <RotateIcon>
      <div className="w-8 h-8">
        <Star fill="yellow" stroke="white" />
      </div>
    </RotateIcon>
  );
}
