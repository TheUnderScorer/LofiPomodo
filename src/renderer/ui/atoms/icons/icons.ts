import { ReactComponent as DotEmpty } from '../../../../assets/Dot_Empty.svg';
import { ReactComponent as DotFilled } from '../../../../assets/Dot_Filled.svg';
import { ReactComponent as X } from '../../../../assets/X.svg';
import { ReactComponent as Clock } from '../../../../assets/Clock.svg';
import { ReactComponent as PixelCheck } from '../../../../assets/PixelCheck.svg';
import { chakra } from '@chakra-ui/system';

export const iconsMap = {
  DotEmpty: chakra(DotEmpty),
  DotFilled: chakra(DotFilled),
  X: chakra(X),
  Clock: chakra(Clock),
  PixelCheck: chakra(PixelCheck),
};

export type IconName = keyof typeof iconsMap;
