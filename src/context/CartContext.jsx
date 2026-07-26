import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import AuthContext from "./AuthContext";
import {
  getCart,
  addToCartApi,
  updateCartItemApi,
  removeFromCartApi,
  clearCartApi
} from "../api/cartApi";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, token } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  // Load giỏ hàng từ DB khi user đăng nhập
  useEffect(() => {
    if (!user || !token) {
      setCartItems([]);
      return;
    }

    getCart(token)
      .then((res) => setCartItems(res.data || []))
      .catch(() => setCartItems([]));
  }, [user, token]);

  const addToCart = async (product, quantity = 1) => {
    const existing = cartItems.find(
      (item) => item.id === product.id
    );

    if (existing) {
      const newQuantity = existing.quantity + quantity;
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      try {
        await updateCartItemApi(product.id, newQuantity, token);
      } catch {
        // rollback on error
        setCartItems(
          cartItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: existing.quantity }
              : item
          )
        );
      }
    } else {
      setCartItems([
        ...cartItems,
        { ...product, quantity }
      ]);

      try {
        await addToCartApi(product.id, quantity, token);
      } catch {
        setCartItems(cartItems);
      }
    }
  };

  const removeFromCart = async (id) => {
    const prev = cartItems;
    setCartItems(
      cartItems.filter((item) => item.id !== id)
    );

    try {
      await removeFromCartApi(id, token);
    } catch {
      setCartItems(prev);
    }
  };

  const updateQuantity = async (id, quantity) => {
    const prev = cartItems;
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );

    try {
      await updateCartItemApi(id, quantity, token);
    } catch {
      setCartItems(prev);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    try {
      await clearCartApi(token);
    } catch {
      // silent fail
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
