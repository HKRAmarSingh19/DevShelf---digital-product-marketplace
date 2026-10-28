import { create } from 'zustand';

export interface CartItem {
  id: string;
  title: string;
  slug: string;
  priceInRupees: number;
  thumbnailUrl?: string;
  sellerName?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  totalInRupees: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => {
    if (!get().isInCart(item.id)) {
      set((state) => ({ items: [...state.items, item] }));
    }
  },
  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
  },
  clearCart: () => set({ items: [] }),
  isInCart: (id) => get().items.some((item) => item.id === id),
  totalInRupees: () => get().items.reduce((sum, item) => sum + item.priceInRupees, 0),
}));
