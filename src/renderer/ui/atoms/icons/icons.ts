import { ReactComponent as DotEmpty } from '../../../../assets/Dot_Empty.svg';
import { ReactComponent as DotFilled } from '../../../../assets/Dot_Filled.svg';
import { ReactComponent as X } from '../../../../assets/X.svg';
import { ReactComponent as Clock } from '../../../../assets/Clock.svg';
import { ReactComponent as PixelCheck } from '../../../../assets/PixelCheck.svg';
import { ReactComponent as Arrow } from '../../../../assets/Arrow.svg';
import { ReactComponent as Coin } from '../../../../assets/Coin.svg';
import { ReactComponent as Info } from '../../../../assets/Info.svg';
import { ReactComponent as Squares } from '../../../../assets/Squares.svg';
import { ReactComponent as Star } from '../../../../assets/Star.svg';
import { ReactComponent as Hourglass } from '../../../../assets/Hourglass.svg';
import { chakra } from '@chakra-ui/system';
import { EllipsisIcon } from './EllipsisIcon';

export const iconsMap = {
  DotEmpty: chakra(DotEmpty),
  DotFilled: chakra(DotFilled),
  X: chakra(X),
  Clock: chakra(Clock),
  PixelCheck: chakra(PixelCheck),
  // TODO Add <div>Icon made from <a href="http://www.onlinewebfonts.com/icon">Icon Fonts</a> is licensed by CC BY 3.0</div>
  Arrow: chakra(Arrow),
  Info: chakra(Info),
  Coin: chakra(Coin),
  Star: chakra(Star),
  Squares: chakra(Squares),
  Hourglass: chakra(Hourglass),
  Ellipsis: EllipsisIcon,
};

export type IconName = keyof typeof iconsMap;
