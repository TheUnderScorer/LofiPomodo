import { BaseIconProps } from './types';
import { composeIcon } from './composeIcon';
import ArrowWhite from '../../../../assets/arrow-white.png';
import ArrowBlack from '../../../../assets/arrow-black.png';

type Direction = 'up' | 'left' | 'right' | 'down';

export interface ArrowIconProps extends BaseIconProps {
  direction: Direction;
}

const directionTransforms: Record<Direction, number> = {
  up: 0,
  down: 180,
  right: -90,
  left: 90,
};

const getTransform = (direction: Direction) => {
  if (!direction) {
    return 0;
  }

  return directionTransforms[direction];
};

export const ArrowIcon = composeIcon<ArrowIconProps>({
  iconMap: {
    dark: ArrowWhite,
    light: ArrowBlack,
  },
  type: 'img',
  alt: 'Arrow',
  additionalProps: (props) => ({
    transform: `rotate(${getTransform(props.direction)}deg)`,
  }),
});
