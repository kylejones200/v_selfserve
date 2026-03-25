/**
 * In-memory localStorage for tests (avoids Node/happy-dom storage API issues).
 */
const store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => {
    store[key] = value;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    for (const key of Object.keys(store)) delete store[key];
  },
  get length() {
    return Object.keys(store).length;
  },
  key: () => null,
};
Object.defineProperty(globalThis, 'localStorage', { value: mockLocalStorage, writable: true });
