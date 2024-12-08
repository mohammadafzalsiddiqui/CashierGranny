// global.d.ts
export {};

declare global {
  interface Window {
    ethereum?: any; // Use a specific type if available
  }
}
