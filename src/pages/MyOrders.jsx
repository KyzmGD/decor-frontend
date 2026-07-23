import {
  useEffect,
  useState,
  useContext
} from "react";

import AuthContext
  from "../context/AuthContext";

import MainLayout
  from "../layouts/MainLayout";

import {
  getMyOrders
} from "../api/orderApi";
import LanguageContext from "../context/LanguageContext";

function MyOrders() {
  const { t } = useContext(LanguageContext);

  const { token } =
    useContext(
      AuthContext
    );

  const [
    orders,
    setOrders
  ] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders =
    async () => {

      try {

        const response =
          await getMyOrders(
            token
          );

        setOrders(
          response.data
        );

      } catch (error) {

        console.error(
          error
        );

      }

    };

  return (
    <MainLayout>

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-10
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            mb-8
          "
        >
          {t("user.myOrders")}
        </h1>

        {orders.length === 0 ? (

          <p>
            {t("user.noOrders")}
          </p>

        ) : (

          orders.map(
            (order) => (

              <div
                key={order.id}
                className="
                  border
                  rounded
                  p-6
                  mb-6
                "
              >

                <div
                  className="
                    flex
                    justify-between
                    mb-4
                  "
                >

                  <h2>
                    {t("user.order")} #
                    {order.id}
                  </h2>

                  <span>
                    {order.status}
                  </span>

                </div>

                <p>
                  {t("common.total")}:
                  $
                  {order.totalPrice}
                </p>

                <p>
                  {t("common.address")}:
                  {order.address}
                </p>

                <p>
                  {t("common.phone")}:
                  {order.phone}
                </p>
                <div
  className="
    mt-4
  "
>

  <h3
    className="
      font-semibold
      mb-2
    "
  >
    {t("user.productsInOrder")}
  </h3>

  {order.OrderItems?.map(
    (item) => (

      <div
        key={item.id}
      >

        {item.Product?.name}
        {" - "}
        {t("common.quantity")}:
        {item.quantity}

      </div>

    )
  )}

</div>
              </div>

            )
          )

        )}

      </div>

    </MainLayout>
  );
}

export default MyOrders;
