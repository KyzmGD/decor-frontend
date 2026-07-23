import { createContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart =
      localStorage.getItem("cart");

    if (savedCart) {
      setCartItems(
        JSON.parse(savedCart)
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const existing =
      cartItems.find(
        item => item.id === product.id
      );

    if (existing) {
      setCartItems(
        cartItems.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + quantity
              }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity
        }
      ]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(
      cartItems.filter(
        item => item.id !== id
      )
    );
  };

  const updateQuantity = (
    id,
    quantity
  ) => {
    setCartItems(
      cartItems.map(item =>
        item.id === id
          ? {
              ...item,
              quantity
            }
          : item
      )
    );
  };
  const clearCart = () => {

  localStorage.removeItem(
    "cart"
  );

  setCartItems([]);

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
