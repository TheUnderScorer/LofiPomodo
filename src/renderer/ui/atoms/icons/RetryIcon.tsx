import RetryBlack from '../../../../assets/retry-black.png';
import RetryWhite from '../../../../assets/retry-white.png';
import { composeIcon } from './composeIcon';
import { BaseIconProps } from './types';

export interface RetryIconProps extends BaseIconProps {}

export const RetryIcon = composeIcon<RetryIconProps>({
  iconMap: {
    dark: RetryBlack,
    light: RetryWhite,
  },
  type: 'img',
  alt: '',
});
