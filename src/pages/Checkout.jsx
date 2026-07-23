import {
  useContext,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import CartContext
  from "../context/CartContext";

import AuthContext
  from "../context/AuthContext";

import {
  createOrder
} from "../api/orderApi";

import MainLayout
  from "../layouts/MainLayout";

function Checkout() {

  const navigate =
    useNavigate();

  const {
    cartItems,
    clearCart
  } = useContext(
    CartContext
  );

  const {
    token
  } = useContext(
    AuthContext
  );

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const total =
    cartItems.reduce(
      (sum, item) =>
        sum +
        item.price *
          item.quantity,
      0
    );

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        cartItems.length === 0
      ) {
        alert(
          "Cart is empty"
        );
        return;
      }

      try {

        setLoading(true);

        await createOrder(
  {
    items: cartItems,
    totalPrice: total,
    address,
    phone
  },
  token
);

clearCart();

alert(
  "Order placed successfully"
);

navigate("/");

      } catch (error) {

  console.error(
    "ORDER ERROR:",
    error.response?.data || error
  );

  alert(
    JSON.stringify(
      error.response?.data ||
      error.message
    )
  );

} finally {

        setLoading(false);

      }
    };

  return (
    <MainLayout>

      <div
        className="
          max-w-3xl
          mx-auto
          py-10
          px-6
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            mb-6
          "
        >
          Checkout
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="mb-4">

            <label>
              Phone
            </label>

            <input
              type="text"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              className="
                border
                w-full
                p-3
                rounded
              "
              required
            />

          </div>

          <div className="mb-4">

            <label>
              Address
            </label>

            <textarea
              value={address}
              onChange={(e) =>
                setAddress(
                  e.target.value
                )
              }
              className="
                border
                w-full
                p-3
                rounded
              "
              rows="4"
              required
            />

          </div>

          <div
            className="
              border
              p-4
              mb-6
              rounded
            "
          >

            <h2
              className="
                text-xl
                font-semibold
                mb-3
              "
            >
              Order Summary
            </h2>

            {cartItems.map(
              item => (

                <div
                  key={item.id}
                  className="
                    flex
                    justify-between
                    mb-2
                  "
                >

                  <span>
                    {item.name}
                    {" "}
                    ×
                    {" "}
                    {item.quantity}
                  </span>

                  <span>
                    $
                    {
                      (
                        item.price *
                        item.quantity
                      ).toFixed(2)
                    }
                  </span>

                </div>

              )
            )}

            <hr className="my-3" />

            <div
              className="
                flex
                justify-between
                font-bold
              "
            >

              <span>
                Total
              </span>

              <span>
                $
                {
                  total.toFixed(2)
                }
              </span>

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              bg-black
              text-white
              px-6
              py-3
              rounded
              w-full
            "
          >

            {loading
              ? "Placing Order..."
              : "Place Order"}

          </button>

        </form>

      </div>

    </MainLayout>
  );
}

export default Checkout;