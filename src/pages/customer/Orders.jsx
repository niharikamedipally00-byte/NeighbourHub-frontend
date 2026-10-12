// src/pages/customer/Orders.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../../services/orderService";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      const token = localStorage.getItem(
        "neighbourhub_token"
      );

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getMyOrders(token);

        console.log("MY ORDERS RESPONSE:", data);

        setOrders(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(
          "Orders loading error:",
          err
        );

        setError(
          err.message ||
            "Unable to load orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [navigate]);

  const getStatus = (status) => {
    return String(status || "PLACED")
      .replaceAll("_", " ")
      .toLowerCase();
  };

  const isActive = (status) => {
    const value = String(
      status || ""
    ).toUpperCase();

    return [
      "PLACED",
      "CONFIRMED",
      "PROCESSING",
      "OUT_FOR_DELIVERY",
    ].includes(value);
  };

  const isCompleted = (status) => {
    const value = String(
      status || ""
    ).toUpperCase();

    return [
      "DELIVERED",
      "COMPLETED",
    ].includes(value);
  };

  const filteredOrders =
    orders.filter((order) => {
      if (activeTab === "All") {
        return true;
      }

      if (activeTab === "Active") {
        return isActive(order.status);
      }

      if (activeTab === "Completed") {
        return isCompleted(order.status);
      }

      if (activeTab === "Cancelled") {
        return (
          String(order.status || "")
            .toUpperCase() ===
          "CANCELLED"
        );
      }

      return true;
    });

  const totalSpent = orders.reduce(
    (total, order) =>
      total +
      Number(order.totalAmount || 0),
    0
  );

  const activeCount =
    orders.filter((order) =>
      isActive(order.status)
    ).length;

  const completedCount =
    orders.filter((order) =>
      isCompleted(order.status)
    ).length;

  const formatDate = (date) => {
    if (!date) {
      return "Recently";
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return String(date);
    }

    return value.toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  const getItems = (order) => {
    if (Array.isArray(order.items)) {
      return order.items;
    }

    if (Array.isArray(order.orderItems)) {
      return order.orderItems;
    }

    if (Array.isArray(order.products)) {
      return order.products;
    }

    return [];
  };

  const getItemName = (item) => {
    return (
      item.productName ||
      item.name ||
      item.product?.name ||
      "Product"
    );
  };

  const getItemQuantity = (item) => {
    return (
      item.quantity ||
      1
    );
  };

  const getItemPrice = (item) => {
    return Number(
      item.price ||
        item.unitPrice ||
        item.product?.price ||
        0
    );
  };

  if (loading) {
    return (
      <div className="customer-orders-page">

        <section className="customer-orders-header">

          <div>

            <p className="customer-orders-eyebrow">
              ACTIVITY
            </p>

            <h1>
              Orders & requests
            </h1>

            <p className="customer-orders-description">
              Loading your orders...
            </p>

          </div>

        </section>

        <div className="customer-orders-empty">

          <div className="customer-empty-icon">
            📦
          </div>

          <h3>
            Loading orders...
          </h3>

          <p>
            Retrieving your latest orders.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="customer-orders-page">

      <section className="customer-orders-header">

        <div>

          <p className="customer-orders-eyebrow">
            ACTIVITY
          </p>

          <h1>
            Orders & requests
          </h1>

          <p className="customer-orders-description">
            Track your purchases and service requests.
          </p>

        </div>

      </section>


      {error && (
        <div className="customer-orders-error">
          {error}
        </div>
      )}


      <section className="customer-orders-summary">

        <div className="customer-order-summary-card">

          <div className="customer-summary-icon">
            📦
          </div>

          <div>

            <strong>
              {orders.length}
            </strong>

            <span>
              Total orders
            </span>

          </div>

        </div>


        <div className="customer-order-summary-card">

          <div className="customer-summary-icon">
            🚚
          </div>

          <div>

            <strong>
              {activeCount}
            </strong>

            <span>
              Active
            </span>

          </div>

        </div>


        <div className="customer-order-summary-card">

          <div className="customer-summary-icon">
            ✓
          </div>

          <div>

            <strong>
              {completedCount}
            </strong>

            <span>
              Completed
            </span>

          </div>

        </div>


        <div className="customer-order-summary-card">

          <div className="customer-summary-icon">
            ₹
          </div>

          <div>

            <strong>
              ₹{totalSpent.toFixed(2)}
            </strong>

            <span>
              Total spent
            </span>

          </div>

        </div>

      </section>


      <section className="customer-orders-section">

        <div className="customer-orders-section-header">

          <div>

            <p>
              YOUR ACTIVITY
            </p>

            <h2>
              Recent orders
            </h2>

          </div>

          <span className="customer-order-count">
            {filteredOrders.length} orders
          </span>

        </div>


        <div className="customer-orders-tabs">

          {[
            "All",
            "Active",
            "Completed",
            "Cancelled",
          ].map((tab) => (

            <button
              type="button"
              key={tab}
              className={
                activeTab === tab
                  ? "customer-order-tab active"
                  : "customer-order-tab"
              }
              onClick={() =>
                setActiveTab(tab)
              }
            >
              {tab}
            </button>

          ))}

        </div>


        <div className="customer-orders-list">

          {filteredOrders.map((order) => {

            const items =
              getItems(order);

            const statusClass =
              getStatus(
                order.status
              ).replaceAll(
                " ",
                "-"
              );

            return (
              <article
                className="customer-order-card"
                key={order.id}
              >

                <div className="customer-order-icon">
                  📦
                </div>


                <div className="customer-order-content">

                  <div className="customer-order-top">

                    <div className="customer-order-title">

                      <h3>
                        Order #{order.id}
                      </h3>

                      <span>
                        Product Order
                      </span>

                    </div>


                    <strong className="customer-order-amount">
                      ₹
                      {Number(
                        order.totalAmount ||
                          0
                      ).toFixed(2)}
                    </strong>

                  </div>


                  <div className="customer-order-items">

                    {items.length > 0 ? (

                      <div className="customer-order-items-list">

                        {items.map(
                          (item, index) => (

                            <div
                              className="customer-order-item"
                              key={
                                item.id ||
                                index
                              }
                            >

                              <div>

                                <strong>
                                  {getItemName(
                                    item
                                  )}
                                </strong>

                                <span>
                                  Qty:{" "}
                                  {getItemQuantity(
                                    item
                                  )}
                                </span>

                              </div>

                              <strong>
                                ₹
                                {(
                                  getItemPrice(
                                    item
                                  ) *
                                  getItemQuantity(
                                    item
                                  )
                                ).toFixed(2)}
                              </strong>

                            </div>

                          )
                        )}

                      </div>

                    ) : (

                      <span>
                        Local shop order
                      </span>

                    )}

                  </div>


                  <div className="customer-order-meta">

                    <span>
                      Order #{order.id}
                    </span>

                    <span>
                      {formatDate(
                        order.createdAt
                      )}
                    </span>

                    <span
                      className={`customer-order-status status-${statusClass}`}
                    >
                      {getStatus(
                        order.status
                      )}
                    </span>

                  </div>

                </div>


                <button
                  type="button"
                  className="customer-order-arrow"
                  onClick={() =>
                    navigate(
                      `/orders/${order.id}`
                    )
                  }
                >
                  →
                </button>

              </article>
            );
          })}


          {filteredOrders.length === 0 && (

            <div className="customer-orders-empty">

              <div className="customer-empty-icon">
                📦
              </div>

              <h3>
                {orders.length === 0
                  ? "No orders yet"
                  : "No orders found"}
              </h3>

              <p>
                {orders.length === 0
                  ? "Your orders will appear here after you place your first order."
                  : "There are no orders in this category."}
              </p>

              {orders.length === 0 && (

                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    navigate("/explore")
                  }
                >
                  Explore Local Shops
                </button>

              )}

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default Orders;