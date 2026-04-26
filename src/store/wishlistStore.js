import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items;
        const exists = items.find((i) => i.id === product.id);

        if (!exists) {
          set({
            items: [
              ...items,
              {
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.images?.[0]?.src || "",
                slug: product.slug,
                date_added: new Date().toISOString(),
              },
            ],
          });
          return true;
        }
        return false;
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.id !== productId) });
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.id === productId);
      },

      toggleWishlist: (product) => {
        if (get().isInWishlist(product.id)) {
          get().removeItem(product.id);
          return false;
        } else {
          get().addItem(product);
          return true;
        }
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "kanyakunj-wishlist",
    }
  )
);

export default useWishlistStore;
