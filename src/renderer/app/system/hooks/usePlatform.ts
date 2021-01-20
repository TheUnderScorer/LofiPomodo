import { atom, useRecoilValue } from 'recoil';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import { AppSystemEvents } from '../../../../shared/types/system';
import { useEffect, useState } from 'react';

interface Is {
  windows: boolean;
  development: boolean;
  macos: boolean;
  linux: boolean;
}

const platformAtom = atom<NodeJS.Platform | null>({
  default: null,
  key: 'platform',
});

const platformIsAtom = atom<Is>({
  default: {
    development: false,
    windows: false,
    macos: false,
    linux: false,
  },
  key: 'platformIs',
});

export const usePlatform = () => {
  const [didFetch, setDidFetch] = useState(false);

  const [getPlatform] = useIpcInvoke(AppSystemEvents.GetPlatform, {
    recoilAtom: platformAtom,
  });
  const [getIs] = useIpcInvoke<never, Is>(AppSystemEvents.GetIs, {
    recoilAtom: platformIsAtom,
  });

  const platform = useRecoilValue(platformAtom);
  const is = useRecoilValue(platformIsAtom);

  useEffect(() => {
    if (!didFetch) {
      setDidFetch(true);

      Promise.all([getPlatform(), getIs()]).catch(console.error);
    }
  }, [didFetch, getIs, getPlatform]);

  return {
    platform,
    is,
  };
};
