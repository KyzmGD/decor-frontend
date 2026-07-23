import {
  useContext
} from "react";

import CartContext
  from "../context/CartContext";
import { formatCurrency } from "../utils/currency";

function Cart() {

  const {
    cartItems,
    removeFromCart,
    updateQuantity
  } = useContext(
    CartContext
  );

  const total =
    cartItems.reduce(
      (sum, item) =>
        sum +
        item.price *
          item.quantity,
      0
    );

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Shopping Cart
      </h1>

      {cartItems.map(item => (

        <div
          key={item.id}
          className="
            border
            p-4
            mb-4
            flex
            justify-between
          "
        >

          <div>

            <h3>
              {item.name}
            </h3>

            <p>
              {formatCurrency(item.price)}
            </p>

          </div>

          <div>

            <input
              type="number"
              min="1"
              value={
                item.quantity
              }
              onChange={e =>
                updateQuantity(
                  item.id,
                  Number(
                    e.target
                      .value
                  )
                )
              }
              className="
                border
                w-20
              "
            />

            <button
              onClick={() =>
                removeFromCart(
                  item.id
                )
              }
              className="
                ml-4
                text-red-500
              "
            >
              Remove
            </button>

          </div>

        </div>

      ))}

      <h2 className="text-2xl font-bold mt-6">
        Total: {formatCurrency(total)}
      </h2>

    </div>
  );
}

export default Cart;
