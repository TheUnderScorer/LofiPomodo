import { BaseIconProps } from './types';
import { composeIcon } from './composeIcon';
import '../../../../assets/pointer-white.png';
import '../../../../assets/pointer-black.png';
import ArrowWhite from '../../../../assets/pointer-white.png';
import ArrowBlack from '../../../../assets/pointer-black.png';

type Direction = 'up' | 'left' | 'right' | 'down';

export interface ArrowIconProps extends BaseIconProps {
  iconDirection?: Direction;
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
  alt: '',
  additionalProps: (props) => ({
    transform: props.iconDirection
      ? `rotate(${getTransform(props.iconDirection)}deg)`
      : undefined,
  }),
});
