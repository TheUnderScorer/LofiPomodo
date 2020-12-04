import { atom, useRecoilValue } from 'recoil';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import { AppSystemEvents } from '../../../../shared/types/system';
import { useEffect, useState } from 'react';

const platformAtom = atom<NodeJS.Platform | null>({
  default: null,
  key: 'platform',
});

export const usePlatform = () => {
  const [didFetch, setDidFetch] = useState(false);
  const [getPlatform] = useIpcInvoke(AppSystemEvents.GetPlatform, {
    recoilAtom: platformAtom,
  });

  const platform = useRecoilValue(platformAtom);

  useEffect(() => {
    if (!didFetch) {
      setDidFetch(true);

      getPlatform();
    }
  }, [didFetch, getPlatform]);

  return platform;
};
