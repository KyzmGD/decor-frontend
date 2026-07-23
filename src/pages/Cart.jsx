import {
  useContext
} from "react";

import CartContext
  from "../context/CartContext";

import {
  Link
} from "react-router-dom";

import MainLayout
  from "../layouts/MainLayout";
import LanguageContext from "../context/LanguageContext";

function Cart() {
  const { t } = useContext(LanguageContext);

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
  <MainLayout>
    <div
      className="
        max-w-6xl
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
        {t("user.shoppingCart")}
      </h1>

      {cartItems.length === 0 ? (

        <p>
          {t("user.emptyCart")}
        </p>

      ) : (

        <>
          {cartItems.map(
            (item) => (

              <div
                key={item.id}
                className="
                  border
                  rounded
                  p-4
                  mb-4
                  flex
                  justify-between
                  items-center
                "
              >

                <div>

                  <h3
                    className="
                      font-semibold
                    "
                  >
                    {item.name}
                  </h3>

                  <p>
                    $
                    {item.price}
                  </p>

                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <input
                    type="number"
                    min="1"
                    value={
                      item.quantity
                    }
                    onChange={(e) =>
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
                      px-2
                      py-1
                    "
                  />

                  <button
                    onClick={() =>
                      removeFromCart(
                        item.id
                      )
                    }
                    className="
                      bg-red-500
                      text-white
                      px-3
                      py-1
                      rounded
                    "
                  >
                    {t("common.remove")}
                  </button>

                </div>

              </div>

            )
          )}

          <div
  className="
    mt-8
    text-right
  "
>

  <h2
    className="
      text-2xl
      font-bold
      mb-4
    "
  >
    {t("common.total")}: $
    {total.toFixed(2)}
  </h2>

  <Link
    to="/checkout"
    className="
      bg-black
      text-white
      px-6
      py-3
      rounded
      inline-block
    "
  >
    {t("user.checkout")}
  </Link>

</div>

        </>

      )}

    </div>
    </MainLayout>
  );
}

export default Cart;
