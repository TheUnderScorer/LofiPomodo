import { ReactComponent as DotEmpty } from '../../../../assets/Dot_Empty.svg';
import { ReactComponent as DotFilled } from '../../../../assets/Dot_Filled.svg';
import { ReactComponent as X } from '../../../../assets/X.svg';

export const iconsMap = {
  DotEmpty,
  DotFilled,
  X,
};

export type IconName = keyof typeof iconsMap;
