// src/types/shims-nprogress.d.ts
declare module 'nprogress' {
    const start: () => void;
    const done: () => void;
    const configure: (options: Record<string, any>) => void;
    export { start, done, configure };
}
