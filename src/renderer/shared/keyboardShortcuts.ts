import { getPlatform } from './platform/getPlatform';

export interface KeyboardShortcut {
  key: string;
  display: string;
}

type ShortcutMap = {
  [Key in ReturnType<typeof getPlatform>]?: KeyboardShortcut;
};

const registerShortcut = (
  platformMap: ShortcutMap
) => (): KeyboardShortcut | null => {
  const platform = getPlatform();

  return platformMap[platform] ?? null;
};

export const keyboardShortcuts = {
  deleteTask: registerShortcut({
    win32: {
      display: 'ctrl D',
      key: 'ctrl+D',
    },
    darwin: {
      display: '⌘D',
      key: '⌘+D',
    },
  }),
};
