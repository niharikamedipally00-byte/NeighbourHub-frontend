import { useState } from "react";

function AvailableDeliveries() {
  const [requests, setRequests] = useState([
    {
      id: "NH-2051",
      shop: "Fresh Mart",
      customer: "Rahul Sharma",
      pickup: "Kondapur",
      drop: "Kukatpally",
      distance: "5.2 km",
      amount: 85,
      items: 4,
    },
    {
      id: "NH-2052",
      shop: "Daily Needs",
      customer: "Priya Reddy",
      pickup: "Madhapur",
      drop: "Gachibowli",
      distance: "4.1 km",
      amount: 70,
      items: 3,
    },
    {
      id: "NH-2053",
      shop: "Green Basket",
      customer: "Arjun Kumar",
      pickup: "Manikonda",
      drop: "Narsingi",
      distance: "3.6 km",
      amount: 65,
      items: 5,
    },
  ]);

  const handleAccept = (id) => {
    setRequests((current) =>
      current.filter((request) => request.id !== id)
    );
  };

  return (
    <div className="delivery-available-page">
      <div className="delivery-available-header">
        <div>
          <p className="delivery-eyebrow">DELIVERIES</p>
          <h1>Available Deliveries</h1>
          <p>Find nearby orders and accept delivery requests.</p>
        </div>

        <div className="delivery-online-badge">
          <span></span>
          Online
        </div>
      </div>

      <div className="delivery-available-summary">
        <div className="delivery-available-summary-card">
          <span>Available Orders</span>
          <strong>{requests.length}</strong>
          <small>Nearby requests</small>
        </div>

        <div className="delivery-available-summary-card">
          <span>Service Area</span>
          <strong>Hyderabad</strong>
          <small>Your current delivery area</small>
        </div>

        <div className="delivery-available-summary-card">
          <span>Average Distance</span>
          <strong>4.3 km</strong>
          <small>Per delivery</small>
        </div>

        <div className="delivery-available-summary-card">
          <span>Average Earnings</span>
          <strong>₹73</strong>
          <small>Per delivery</small>
        </div>
      </div>

      <section className="delivery-available-card">
        <div className="delivery-available-card-header">
          <div>
            <h2>Nearby Delivery Requests</h2>
            <p>Choose a delivery that works for you.</p>
          </div>
        </div>

        <div className="delivery-available-list">
          {requests.map((request) => (
            <div className="delivery-available-row" key={request.id}>
              <div className="delivery-available-icon">
                {request.shop.charAt(0)}
              </div>

              <div className="delivery-available-info">
                <div className="delivery-available-title">
                  <strong>{request.id}</strong>
                  <span>{request.distance}</span>
                </div>

                <h3>{request.shop}</h3>

                <p>
                  Deliver to <strong>{request.customer}</strong>
                </p>

                <div className="delivery-available-route">
                  <span>{request.pickup}</span>
                  <span>→</span>
                  <span>{request.drop}</span>
                </div>

                <small>{request.items} items</small>
              </div>

              <div className="delivery-available-right">
                <strong>₹{request.amount}</strong>

                <button
                  className="delivery-accept-button"
                  onClick={() => handleAccept(request.id)}
                >
                  Accept Delivery
                </button>
              </div>
            </div>
          ))}

          {requests.length === 0 && (
            <div className="delivery-available-empty">
              <h3>No deliveries available</h3>
              <p>
                New delivery requests will appear here when they become
                available.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AvailableDeliveries;