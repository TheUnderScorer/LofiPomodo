import { getPlatform } from './platform/getPlatform';

export interface KeyboardShortcut {
  // Key that can be referenced in electron process
  rendererKey: string;
  // Key that can be used in renderer process
  electronKey: string;
  // Key that can be used for display (both in electron and renderer process)
  display: string;
}

type ShortcutMap = {
  [Key in NodeJS.Platform]?: KeyboardShortcut;
};

const registerShortcut = (platformMap: ShortcutMap) => (
  providedPlatform?: NodeJS.Platform
): KeyboardShortcut | null => {
  const platform = providedPlatform ?? getPlatform();

  return platformMap[platform] ?? platformMap.win32 ?? null;
};

export const keyboardShortcuts = {
  deleteTask: registerShortcut({
    win32: {
      display: 'ctrl D',
      rendererKey: 'ctrl+D',
      electronKey: 'Control+D',
    },
    darwin: {
      display: '⌘ D',
      rendererKey: '⌘+D',
      electronKey: 'CommandOrControl+D',
    },
  }),
  togglePomodoro: registerShortcut({
    win32: {
      display: 'ctrl P',
      rendererKey: 'ctrl+P',
      electronKey: 'Control+P',
    },
    darwin: {
      display: '⌘ P',
      rendererKey: '⌘+P',
      electronKey: 'CommandOrControl+P',
    },
  }),
  moveToNextPomodoroState: registerShortcut({
    win32: {
      display: 'ctrl N',
      rendererKey: 'ctrl+N',
      electronKey: 'Control+N',
    },
    darwin: {
      display: '⌘ N',
      rendererKey: '⌘+N',
      electronKey: 'CommandOrControl+N',
    },
  }),
};

export type KeyboardShortcuts = typeof keyboardShortcuts;
