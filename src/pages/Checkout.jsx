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
import LanguageContext from "../context/LanguageContext";

function Checkout() {
  const { t } = useContext(LanguageContext);

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
          t("user.cartEmptyError")
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
  t("user.orderSuccess")
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
          {t("user.checkout")}
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="mb-4">

            <label>
              {t("common.phone")}
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
              {t("common.address")}
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
              {t("user.orderSummary")}
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
                {t("common.total")}
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
              ? t("user.placingOrder")
              : t("user.placeOrder")}

          </button>

        </form>

      </div>

    </MainLayout>
  );
}

export default Checkout;
