import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variation = null, quantity = 1) => {
        const items = get().items;
        const key = variation ? `${product.id}-${variation.id}` : `${product.id}`;
        const existing = items.find((i) => i.key === key);

        const stockQuantity = variation ? variation.stock_quantity : product.stock_quantity;
        const manageStock = variation ? variation.manage_stock : product.manage_stock;

        if (existing) {
          set({
            items: items.map((i) => {
              if (i.key === key) {
                const newQuantity = i.quantity + quantity;
                return {
                  ...i,
                  quantity: manageStock && stockQuantity !== null && newQuantity > stockQuantity ? stockQuantity : newQuantity,
                  stockQuantity,
                  manageStock
                };
              }
              return i;
            }),
          });
        } else {
          const price = variation
            ? parseFloat(variation.price)
            : parseFloat(product.price);
          const image =
            variation?.image?.src ||
            product.images?.[0]?.src ||
            "";

          set({
            items: [
              ...items,
              {
                key,
                productId: product.id,
                variationId: variation?.id || null,
                name: product.name,
                price,
                image,
                quantity: manageStock && stockQuantity !== null && quantity > stockQuantity ? stockQuantity : quantity,
                attributes: variation?.attributes || [],
                stockQuantity,
                manageStock,
              },
            ],
          });
        }
        set({ isOpen: true });
      },

      removeItem: (key) => {
        set({ items: get().items.filter((i) => i.key !== key) });
      },

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          get().removeItem(key);
          return;
        }
        set({
          items: get().items.map((i) => {
            if (i.key === key) {
              const newQuantity = i.manageStock && i.stockQuantity !== null && quantity > i.stockQuantity ? i.stockQuantity : quantity;
              return { ...i, quantity: newQuantity };
            }
            return i;
          }),
        });
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      // Use these as selector functions: useCartStore(s => s.totalItems())
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "kanyakunj-cart",
    }
  )
);

export default useCartStore;
