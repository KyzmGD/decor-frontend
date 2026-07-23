import {
  createContext,
  useCallback,
  useMemo,
  useState
} from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist") || "[]");
    } catch {
      return [];
    }
  });

  const updateItems = useCallback((updater) => {
    setWishlistItems((currentItems) => {
      const nextItems = updater(currentItems);
      localStorage.setItem("wishlist", JSON.stringify(nextItems));
      return nextItems;
    });
  }, []);

  const isInWishlist = useCallback(
    (productId) =>
      wishlistItems.some((item) => item.id === productId),
    [wishlistItems]
  );

  const addToWishlist = useCallback(
    (product) =>
      updateItems((items) =>
        items.some((item) => item.id === product.id)
          ? items
          : [...items, product]
      ),
    [updateItems]
  );

  const removeFromWishlist = useCallback(
    (productId) =>
      updateItems((items) =>
        items.filter((item) => item.id !== productId)
      ),
    [updateItems]
  );

  const toggleWishlist = useCallback(
    (product) => {
      const willAdd = !isInWishlist(product.id);
      willAdd
        ? addToWishlist(product)
        : removeFromWishlist(product.id);
      return willAdd;
    },
    [addToWishlist, isInWishlist, removeFromWishlist]
  );

  const clearWishlist = useCallback(
    () => updateItems(() => []),
    [updateItems]
  );

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount: wishlistItems.length,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist
    }),
    [
      wishlistItems,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistContext;
