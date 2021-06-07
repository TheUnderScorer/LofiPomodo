declare module '@sindresorhus/do-not-disturb' {
  export interface Dnd {
    enable(): Promise<void>;
    disable(): Promise<void>;
    isEnabled(): Promise<boolean>;
    toggle(force?: boolean): Promise<void>;
  }

  const doNotDisturb: Dnd;

  export default doNotDisturb;
}
