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

        if (existing) {
          set({
            items: items.map((i) =>
              i.key === key ? { ...i, quantity: i.quantity + quantity } : i
            ),
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
                quantity,
                attributes: variation?.attributes || [],
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
          items: get().items.map((i) =>
            i.key === key ? { ...i, quantity } : i
          ),
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
