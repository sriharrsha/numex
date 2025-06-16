// Global Deno type declarations for TypeScript
// This file ensures Deno's global objects are recognized by TypeScript checkers.

declare global {
  namespace Deno {
    export const version: {
      deno: string;
      typescript: string;
      v8: string;
    };

    export const env: {
      get(key: string): string | undefined;
      set(key: string, value: string): void;
      delete(key: string): void;
      toObject(): Record<string, string>;
    };

    // Add other commonly used Deno APIs if needed by your functions
    // For example, for file system access:
    // export function readTextFile(path: string | URL): Promise<string>;
    // export function writeTextFile(path: string | URL, data: string, options?: WriteFileOptions): Promise<void>;
    // interface WriteFileOptions { append?: boolean; create?: boolean; mode?: number; }

    // For crypto:
    // export const crypto: { subtle: SubtleCrypto; getRandomValues<T extends ArrayBufferView | null>(array: T): T; randomUUID(): string; };
  }

  // If your functions use `fetch`, `Request`, `Response`, `Headers`,
  // these are typically covered by DOM or lib.webworker.d.ts, 
  // but you can declare them if specific Deno extensions are used.
  // interface Request {} // Example, usually not needed
  // interface Response {} // Example, usually not needed
  // interface Headers {} // Example, usually not needed
  // function fetch(input: string | URL | Request, init?: RequestInit): Promise<Response>;
}

// This export is to make this file a module, which can sometimes help with global scope.
// It doesn't actually export anything meaningful for this d.ts file's purpose.
export {};
