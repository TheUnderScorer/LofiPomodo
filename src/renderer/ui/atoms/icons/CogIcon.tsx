import { BaseIconProps } from './types';
import { composeIcon } from './composeIcon';
import CogBlack from '../../../../assets/cog-black.png';
import CogWhite from '../../../../assets/cog-white.png';

export interface CogIconProps extends BaseIconProps {}

export const CogIcon = composeIcon<CogIconProps>({
  iconMap: {
    dark: CogWhite,
    light: CogBlack,
  },
  type: 'img',
  alt: '',
});
