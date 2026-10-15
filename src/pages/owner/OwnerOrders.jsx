import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://neighbourhub-backend-uns0.onrender.com";

function OwnerOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const token = localStorage.getItem("neighbourhub_token");

  let user = null;

  try {
    const storedUser = localStorage.getItem("neighbourhub_user");
    if (storedUser) user = JSON.parse(storedUser);
  } catch {
    user = null;
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const shopResponse = await fetch(`${API_URL}/api/shops`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const shopData = await shopResponse.json();

      if (!shopResponse.ok) {
        throw new Error(shopData.message || "Unable to load shops");
      }

      const ownerShops = Array.isArray(shopData)
        ? shopData.filter((shop) => {
            const ownerId =
              shop.ownerId ?? shop.userId ?? shop.owner?.id;

            return String(ownerId) === String(user?.id);
          })
        : [];

      setShops(ownerShops);

      const orderResponse = await fetch(`${API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(
          orderData.message || "Unable to load orders"
        );
      }

      const allOrders = Array.isArray(orderData)
        ? orderData
        : orderData.orders || [];

      const ownerShopIds = ownerShops.map((shop) => String(shop.id));

      const ownerOrders = allOrders.filter((order) => {
        const items = order.items || order.orderItems || [];

        return items.some((item) => {
          const shopId =
            item.shopId ??
            item.product?.shopId ??
            item.product?.shop?.id ??
            item.shop?.id;

          return ownerShopIds.includes(String(shopId));
        });
      });

      setOrders(ownerOrders);
    } catch (err) {
      setError(err.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId, status) {
    try {
      setUpdatingOrder(orderId);
      setError("");

      const response = await fetch(
        `${API_URL}/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update order"
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          String(order.id) === String(orderId)
            ? { ...order, status }
            : order
        )
      );
    } catch (err) {
      setError(err.message || "Unable to update order");
    } finally {
      setUpdatingOrder(null);
    }
  }

  const filteredOrders = useMemo(() => {
    if (activeTab === "ALL") return orders;

    return orders.filter(
      (order) =>
        String(order.status || "").toUpperCase() === activeTab
    );
  }, [orders, activeTab]);

  const pendingOrders = orders.filter((order) =>
    ["PLACED", "PENDING"].includes(
      String(order.status || "").toUpperCase()
    )
  ).length;

  const completedOrders = orders.filter((order) =>
    ["COMPLETED", "DELIVERED"].includes(
      String(order.status || "").toUpperCase()
    )
  ).length;

  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum + Number(order.totalAmount || order.total || 0),
    0
  );

  function getStatusClass(status) {
    const value = String(status || "").toLowerCase();

    if (["completed", "delivered"].includes(value)) {
      return "owner-order-status completed";
    }

    if (["cancelled", "canceled"].includes(value)) {
      return "owner-order-status cancelled";
    }

    if (["confirmed", "processing"].includes(value)) {
      return "owner-order-status processing";
    }

    return "owner-order-status pending";
  }

  function getItems(order) {
    return order.items || order.orderItems || [];
  }

  return (
    <div className="owner-orders-page">
      <div className="owner-orders-header">
        <div>
          <span className="owner-section-label">ORDERS</span>

          <h1>Customer Orders</h1>

          <p>
            Manage orders received from customers through
            NeighbourHub.
          </p>
        </div>

        <button
          type="button"
          className="owner-secondary-button"
          onClick={() => navigate("/owner/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="owner-orders-error">
          {error}
        </div>
      )}

      <div className="owner-orders-stats">
        <div className="owner-order-stat-card">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>

        <div className="owner-order-stat-card">
          <span>Pending</span>
          <strong>{pendingOrders}</strong>
        </div>

        <div className="owner-order-stat-card">
          <span>Completed</span>
          <strong>{completedOrders}</strong>
        </div>

        <div className="owner-order-stat-card">
          <span>Total Revenue</span>
          <strong>₹{totalRevenue.toFixed(2)}</strong>
        </div>
      </div>

      <div className="owner-orders-card">
        <div className="owner-orders-card-header">
          <div>
            <h2>Orders</h2>
            <p>
              {shops.length} shop
              {shops.length !== 1 ? "s" : ""} connected to your
              account.
            </p>
          </div>
        </div>

        <div className="owner-order-tabs">
          {[
            ["ALL", "All"],
            ["PLACED", "Placed"],
            ["PROCESSING", "Processing"],
            ["CONFIRMED", "Confirmed"],
            ["DELIVERED", "Delivered"],
            ["COMPLETED", "Completed"],
            ["CANCELLED", "Cancelled"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={
                activeTab === value
                  ? "owner-order-tab active"
                  : "owner-order-tab"
              }
              onClick={() => setActiveTab(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="owner-orders-loading">
            <div className="owner-loading-mark">...</div>
            <p>Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="owner-orders-empty">
            <div className="owner-empty-icon">□</div>

            <h3>No orders found</h3>

            <p>
              Customer orders for your shop will appear here.
            </p>
          </div>
        ) : (
          <div className="owner-orders-list">
            {filteredOrders.map((order) => {
              const items = getItems(order);

              return (
                <div
                  className="owner-order-card"
                  key={order.id}
                >
                  <div className="owner-order-top">
                    <div>
                      <span className="owner-order-label">
                        ORDER
                      </span>

                      <h3>#{order.id}</h3>

                      <span className="owner-order-date">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleString()
                          : "Date unavailable"}
                      </span>
                    </div>

                    <span
                      className={getStatusClass(
                        order.status
                      )}
                    >
                      {order.status || "PLACED"}
                    </span>
                  </div>

                  <div className="owner-order-customer">
                    <div>
                      <span>Customer</span>
                      <strong>
                        {order.user?.name ||
                          order.customerName ||
                          "Customer"}
                      </strong>
                    </div>

                    <div>
                      <span>Phone</span>
                      <strong>
                        {order.phone ||
                          order.user?.phone ||
                          "Not provided"}
                      </strong>
                    </div>

                    <div>
                      <span>Total</span>
                      <strong>
                        ₹
                        {Number(
                          order.totalAmount ||
                            order.total ||
                            0
                        ).toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  {order.deliveryAddress && (
                    <div className="owner-order-address">
                      <span>Delivery Address</span>
                      <p>{order.deliveryAddress}</p>
                    </div>
                  )}

                  <div className="owner-order-items">
                    <div className="owner-order-items-header">
                      <span>Items</span>
                    </div>

                    {items.length === 0 ? (
                      <p className="owner-no-items">
                        No item details available.
                      </p>
                    ) : (
                      items.map((item, index) => (
                        <div
                          className="owner-order-item"
                          key={
                            item.id ||
                            item.productId ||
                            index
                          }
                        >
                          <div>
                            <strong>
                              {item.productName ||
                                item.product?.name ||
                                item.name ||
                                "Product"}
                            </strong>

                            <span>
                              Qty:{" "}
                              {item.quantity ||
                                item.qty ||
                                1}
                            </span>
                          </div>

                          <strong>
                            ₹
                            {Number(
                              item.price ||
                                item.product?.price ||
                                0
                            ).toFixed(2)}
                          </strong>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="owner-order-actions">
                    {["PLACED", "PENDING"].includes(
                      String(order.status || "").toUpperCase()
                    ) && (
                      <>
                        <button
                          type="button"
                          className="owner-order-action primary"
                          disabled={
                            updatingOrder === order.id
                          }
                          onClick={() =>
                            updateOrderStatus(
                              order.id,
                              "CONFIRMED"
                            )
                          }
                        >
                          {updatingOrder === order.id
                            ? "Updating..."
                            : "Confirm Order"}
                        </button>

                        <button
                          type="button"
                          className="owner-order-action danger"
                          disabled={
                            updatingOrder === order.id
                          }
                          onClick={() =>
                            updateOrderStatus(
                              order.id,
                              "CANCELLED"
                            )
                          }
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {String(
                      order.status || ""
                    ).toUpperCase() === "CONFIRMED" && (
                      <button
                        type="button"
                        className="owner-order-action primary"
                        disabled={
                          updatingOrder === order.id
                        }
                        onClick={() =>
                          updateOrderStatus(
                            order.id,
                            "PROCESSING"
                          )
                        }
                      >
                        {updatingOrder === order.id
                          ? "Updating..."
                          : "Start Processing"}
                      </button>
                    )}

                    {String(
                      order.status || ""
                    ).toUpperCase() === "PROCESSING" && (
                      <button
                        type="button"
                        className="owner-order-action primary"
                        disabled={
                          updatingOrder === order.id
                        }
                        onClick={() =>
                          updateOrderStatus(
                            order.id,
                            "COMPLETED"
                          )
                        }
                      >
                        {updatingOrder === order.id
                          ? "Updating..."
                          : "Mark Completed"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerOrders;