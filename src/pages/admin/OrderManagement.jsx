import {
  useEffect,
  useState,
  useContext
} from "react";

import AuthContext
  from "../../context/AuthContext";

import MainLayout
  from "../../layouts/MainLayout";

import {
  getAllOrders,
  updateOrderStatus
} from "../../api/orderApi";

function OrderManagement() {

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

      const response =
        await getAllOrders(
          token
        );

      setOrders(
        response.data
      );
    };

  const handleStatusChange =
    async (
      id,
      status
    ) => {

      await updateOrderStatus(
        id,
        status,
        token
      );

      loadOrders();
    };

  return (
    <MainLayout>

      <div
        className="
          max-w-7xl
          mx-auto
          p-6
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            mb-6
          "
        >
          Order Management
        </h1>

        {orders.map(
          (order) => (

            <div
              key={order.id}
              className="
                border
                rounded
                p-4
                mb-4
              "
            >

              <div
                className="
                  flex
                  justify-between
                "
              >

                <h2>
                  Order #{order.id}
                </h2>

                <select
                  value={
                    order.status
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      order.id,
                      e.target.value
                    )
                  }
                  className="
                    border
                    px-2
                    py-1
                  "
                >

                  <option>
                    Pending
                  </option>

                  <option>
                    Processing
                  </option>

                  <option>
                    Shipped
                  </option>

                  <option>
                    Delivered
                  </option>

                </select>

              </div>

              <p>
                Customer:
                {" "}
                {order.User?.fullname}
              </p>

              <p>
                Total:
                $
                {order.totalPrice}
              </p>
            <div
  className="
    mt-3
  "
>

  <h3
    className="
      font-semibold
    "
  >
    Products
  </h3>

  {order.OrderItems?.map(
    (item) => (

      <div
        key={item.id}
      >

        {item.Product?.name}
        {" "}
        x
        {item.quantity}

      </div>

    )
  )}

</div>
            </div>

          )
        )}

      </div>

    </MainLayout>
  );
}

export default OrderManagement;