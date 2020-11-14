import { MenuItemConstructorOptions } from 'electron';

export const createSectionTitle = (
  title: string
): MenuItemConstructorOptions => ({
  label: title,
  enabled: false,
});
