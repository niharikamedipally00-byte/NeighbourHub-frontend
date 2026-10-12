import { useState } from "react";

function DeliveryHistory() {
  const [activeFilter, setActiveFilter] = useState("All");

  const deliveries = [
    {
      id: "NH-2041",
      customer: "Rahul Sharma",
      shop: "Fresh Mart",
      location: "Kondapur",
      date: "Today, 10:30 AM",
      amount: 80,
      status: "DELIVERED",
    },
    {
      id: "NH-2038",
      customer: "Priya Reddy",
      shop: "Daily Needs",
      location: "Madhapur",
      date: "Yesterday, 06:15 PM",
      amount: 65,
      status: "DELIVERED",
    },
    {
      id: "NH-2032",
      customer: "Arjun Kumar",
      shop: "Green Basket",
      location: "Gachibowli",
      date: "Oct 9, 2026",
      amount: 90,
      status: "DELIVERED",
    },
    {
      id: "NH-2027",
      customer: "Sneha Rao",
      shop: "Local Fresh",
      location: "Kukatpally",
      date: "Oct 8, 2026",
      amount: 70,
      status: "CANCELLED",
    },
  ];

  const filters = ["All", "DELIVERED", "CANCELLED"];

  const filteredDeliveries =
    activeFilter === "All"
      ? deliveries
      : deliveries.filter(
          (delivery) => delivery.status === activeFilter
        );

  return (
    <div className="delivery-history-page">
      <div className="delivery-history-header">
        <div>
          <p className="delivery-eyebrow">DELIVERY HISTORY</p>
          <h1>Delivery History</h1>
          <p>View your completed and cancelled deliveries.</p>
        </div>
      </div>

      <div className="delivery-history-summary">
        <div className="delivery-history-summary-card">
          <span>Total Deliveries</span>
          <strong>42</strong>
          <small>All completed deliveries</small>
        </div>

        <div className="delivery-history-summary-card">
          <span>Completed</span>
          <strong>39</strong>
          <small>Successfully delivered</small>
        </div>

        <div className="delivery-history-summary-card">
          <span>Cancelled</span>
          <strong>3</strong>
          <small>Cancelled deliveries</small>
        </div>

        <div className="delivery-history-summary-card">
          <span>Total Earnings</span>
          <strong>₹3,240</strong>
          <small>From completed deliveries</small>
        </div>
      </div>

      <section className="delivery-history-card">
        <div className="delivery-history-toolbar">
          <div>
            <h2>Past Deliveries</h2>
            <p>Your recent delivery activity.</p>
          </div>

          <div className="delivery-history-filters">
            {filters.map((filter) => (
              <button
                key={filter}
                className={
                  activeFilter === filter
                    ? "delivery-history-filter active"
                    : "delivery-history-filter"
                }
                onClick={() => setActiveFilter(filter)}
              >
                {filter === "All"
                  ? "All"
                  : filter.charAt(0) +
                    filter.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="delivery-history-list">
          {filteredDeliveries.map((delivery) => (
            <div className="delivery-history-row" key={delivery.id}>
              <div className="delivery-history-main">
                <div className="delivery-history-icon">
                  {delivery.customer.charAt(0)}
                </div>

                <div className="delivery-history-info">
                  <div className="delivery-history-title">
                    <strong>{delivery.id}</strong>

                    <span
                      className={
                        delivery.status === "DELIVERED"
                          ? "delivery-history-status delivered"
                          : "delivery-history-status cancelled"
                      }
                    >
                      {delivery.status}
                    </span>
                  </div>

                  <h3>{delivery.customer}</h3>

                  <p>
                    {delivery.shop} · {delivery.location}
                  </p>

                  <small>{delivery.date}</small>
                </div>
              </div>

              <div className="delivery-history-right">
                <strong>₹{delivery.amount}</strong>
                <button className="delivery-history-view-button">
                  View Details
                </button>
              </div>
            </div>
          ))}

          {filteredDeliveries.length === 0 && (
            <div className="delivery-history-empty">
              <h3>No deliveries found</h3>
              <p>No deliveries match the selected filter.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default DeliveryHistory;