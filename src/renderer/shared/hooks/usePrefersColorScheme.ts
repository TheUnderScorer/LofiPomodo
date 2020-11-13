import { useMedia } from 'react-use';
import { ColorMode } from '../../../shared/types/color';

export const usePrefersColorScheme = (): ColorMode => {
  const match = useMedia('(prefers-color-scheme: dark)', false);

  return match ? 'dark' : 'light';
};
