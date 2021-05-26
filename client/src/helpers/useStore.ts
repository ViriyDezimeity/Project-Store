import { useContext } from 'react';

export function useStore<T>(storeContext: React.Context<T | null>): T {
  const store = useContext(storeContext);
  if (!store) {
    throw new Error('StoreProvider was not set.');
  }
  return store;
}