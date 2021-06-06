declare module 'bplist-parser' {
  export function parseFile(path: string): Promise<any>;
  export function parseBuffer(buffer: Buffer): Promise<any>;
}
