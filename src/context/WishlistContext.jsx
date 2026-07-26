import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import AuthContext from "./AuthContext";
import {
  getWishlist,
  addToWishlist as addToWishlistApi,
  removeFromWishlist as removeFromWishlistApi,
  clearWishlistApi
} from "../api/wishlistApi";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user, token } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist từ DB khi user đăng nhập
  useEffect(() => {
    if (!user || !token) {
      setWishlistItems([]);
      return;
    }

    getWishlist(token)
      .then((res) => setWishlistItems(res.data || []))
      .catch(() => setWishlistItems([]));
  }, [user, token]);

  const isInWishlist = useCallback(
    (productId) =>
      wishlistItems.some((item) => item.id === productId),
    [wishlistItems]
  );

  const addToWishlist = useCallback(
    async (product) => {
      if (isInWishlist(product.id)) return;

      // Cập nhật UI ngay lập tức (optimistic update)
      setWishlistItems((items) => [...items, product]);

      try {
        await addToWishlistApi(product.id, token);
      } catch {
        // Nếu lỗi, rollback
        setWishlistItems((items) =>
          items.filter((item) => item.id !== product.id)
        );
      }
    },
    [isInWishlist, token]
  );

  const removeFromWishlist = useCallback(
    async (productId) => {
      const prev = wishlistItems;
      setWishlistItems((items) =>
        items.filter((item) => item.id !== productId)
      );

      try {
        await removeFromWishlistApi(productId, token);
      } catch {
        setWishlistItems(prev);
      }
    },
    [wishlistItems, token]
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

  const clearWishlist = useCallback(async () => {
    setWishlistItems([]);
    try {
      await clearWishlistApi(token);
    } catch {
      // silent fail
    }
  }, [token]);

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
