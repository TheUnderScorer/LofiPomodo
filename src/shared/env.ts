export const getIntEnv = (key: string, def: number) =>
  process.env[key] ? parseInt(process.env[key]!, 10) : def;

export const getBoolEnv = (key: string, def: boolean) => {
  const envValue = process.env[key];

  if (envValue === 'true') {
    return true;
  }

  if (envValue === 'false') {
    return false;
  }

  return def;
};
