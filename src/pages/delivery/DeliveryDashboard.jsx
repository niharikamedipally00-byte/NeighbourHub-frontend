import { useNavigate } from "react-router-dom";

function DeliveryDashboard() {

  return (
    <div className="delivery-dashboard">

      {/* Header */}
      <div className="delivery-dashboard-header">
        <div>
          <p className="delivery-eyebrow">
            DELIVERY PARTNER
          </p>

          <h1>Delivery Dashboard</h1>

          <p>
            Manage deliveries and track your current tasks.
          </p>
        </div>

        <span className="delivery-online-badge">
          Online
        </span>
      </div>


      {/* Stats */}
      <div className="delivery-stats-grid">

        <div className="delivery-stat-card">
          <span>Available Orders</span>
          <strong>4</strong>
          <small>Nearby delivery requests</small>
        </div>

        <div className="delivery-stat-card">
          <span>Active Delivery</span>
          <strong>1</strong>
          <small>Currently assigned</small>
        </div>

        <div className="delivery-stat-card">
          <span>Completed Today</span>
          <strong>8</strong>
          <small>Successfully delivered</small>
        </div>

        <div className="delivery-stat-card">
          <span>Today's Earnings</span>
          <strong>₹640</strong>
          <small>Delivery earnings</small>
        </div>

      </div>


      {/* Main Grid */}
      <div className="delivery-dashboard-grid">

        {/* Active Delivery */}
        <section className="delivery-panel">

          <div className="delivery-panel-header">
            <div>
              <h2>Active Delivery</h2>
              <p>Your current delivery assignment.</p>
            </div>

            <span className="delivery-status-badge">
              Out for Delivery
            </span>
          </div>


          <div className="delivery-active-card">

            <div className="delivery-order-top">

              <div>
                <span>Order ID</span>
                <strong>NH-2048</strong>
              </div>

              <div className="delivery-order-amount">
                <span>Order Value</span>
                <strong>₹420</strong>
              </div>

            </div>


            <div className="delivery-route">

              <div className="delivery-route-item">

                <span className="delivery-route-dot pickup"></span>

                <div>
                  <small>Pickup</small>

                  <strong>
                    Fresh Mart
                  </strong>

                  <p>
                    Gachibowli Main Road
                  </p>
                </div>

              </div>


              <div className="delivery-route-line"></div>


              <div className="delivery-route-item">

                <span className="delivery-route-dot drop"></span>

                <div>
                  <small>Deliver To</small>

                  <strong>
                    Rahul Sharma
                  </strong>

                  <p>
                    Financial District, Hyderabad
                  </p>
                </div>

              </div>

            </div>


            <div className="delivery-active-actions">

              <button
                className="delivery-outline-button"
                onClick={() =>
                  navigate("/delivery/history")
                }
              >
                View Details
              </button>

              <button
                className="delivery-primary-button"
                onClick={() =>
                  alert("Directions feature will be connected later.")
                }
              >
                Open Directions
              </button>

            </div>

          </div>

        </section>


        {/* Availability */}
        <section className="delivery-panel">

          <div className="delivery-panel-header">
            <div>
              <h2>Availability</h2>
              <p>
                Control your delivery availability.
              </p>
            </div>
          </div>


          <div className="delivery-availability">

            <div className="delivery-availability-status">

              <span className="delivery-status-indicator"></span>

              <div>
                <strong>
                  You're Online
                </strong>

                <p>
                  Customers can assign deliveries to you.
                </p>
              </div>

            </div>


            <div className="delivery-availability-row">
              <span>Service Area</span>
              <strong>Hyderabad</strong>
            </div>


            <div className="delivery-availability-row">
              <span>Today's Deliveries</span>
              <strong>8 completed</strong>
            </div>


            <button
              className="delivery-outline-button full"
              onClick={() =>
                alert("Availability control will be connected later.")
              }
            >
              Go Offline
            </button>

          </div>

        </section>

      </div>


      {/* Nearby Requests */}
      <section className="delivery-panel delivery-orders-panel">

        <div className="delivery-panel-header">

          <div>
            <h2>
              Nearby Delivery Requests
            </h2>

            <p>
              Available orders that you can accept.
            </p>
          </div>


          <button
            className="delivery-text-button"
            onClick={() =>
              navigate("/delivery/available")
            }
          >
            View All
          </button>

        </div>


        <div className="delivery-request-list">

          <div className="delivery-request-row">

            <div className="delivery-request-icon">
              1
            </div>

            <div className="delivery-request-info">

              <strong>
                NH-2051
              </strong>

              <span>
                Green Basket · 1.8 km away
              </span>

              <small>
                Pickup: Kondapur
              </small>

            </div>

            <div className="delivery-request-right">

              <strong>
                ₹90
              </strong>

              <button
                className="delivery-accept-button"
                onClick={() =>
                  navigate("/delivery/available")
                }
              >
                Accept
              </button>

            </div>

          </div>


          <div className="delivery-request-row">

            <div className="delivery-request-icon">
              2
            </div>

            <div className="delivery-request-info">

              <strong>
                NH-2052
              </strong>

              <span>
                Local Dairy · 2.4 km away
              </span>

              <small>
                Pickup: Gachibowli
              </small>

            </div>

            <div className="delivery-request-right">

              <strong>
                ₹110
              </strong>

              <button
                className="delivery-accept-button"
                onClick={() =>
                  navigate("/delivery/available")
                }
              >
                Accept
              </button>

            </div>

          </div>


          <div className="delivery-request-row">

            <div className="delivery-request-icon">
              3
            </div>

            <div className="delivery-request-info">

              <strong>
                NH-2053
              </strong>

              <span>
                Fresh Mart · 3.1 km away
              </span>

              <small>
                Pickup: Nanakramguda
              </small>

            </div>

            <div className="delivery-request-right">

              <strong>
                ₹125
              </strong>

              <button
                className="delivery-accept-button"
                onClick={() =>
                  navigate("/delivery/available")
                }
              >
                Accept
              </button>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default DeliveryDashboard;