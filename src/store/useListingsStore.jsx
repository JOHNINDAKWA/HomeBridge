import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LISTINGS } from "../data/listings";

export const useListingsStore = create(
  persist(
    (set, get) => ({
      listings: LISTINGS,                // the outer data
      favorites: [],                    // array of listing IDs

      getById: (id) => get().listings.find((l) => l.id === id),

      toggleFavorite: (id) =>
        set((state) => {
          const has = state.favorites.includes(id);
          return {
            favorites: has
              ? state.favorites.filter((x) => x !== id)
              : [...state.favorites, id],
          };
        }),
    }),
    { name: "hbr-listings-v1" }          // localStorage key
  )
);
