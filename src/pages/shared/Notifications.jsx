import { useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "order",
      title: "Order is out for delivery",
      message:
        "Your order from Daily Milk Point is on the way.",
      time: "15 minutes ago",
      unread: true,
    },
    {
      id: 2,
      type: "service",
      title: "Service request accepted",
      message:
        "Ravi Plumbing Services accepted your request.",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      type: "shop",
      title: "New shop near you",
      message:
        "A new local shop has joined NeighbourHub.",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 4,
      type: "review",
      title: "Share your experience",
      message:
        "How was your recent experience with Fresh Basket?",
      time: "Yesterday",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter(
    (item) => item.unread
  ).length;

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        unread: false,
      }))
    );
  };

  const getIcon = (type) => {
    if (type === "order") return "O";
    if (type === "service") return "S";
    if (type === "shop") return "N";
    return "R";
  };

  return (
    <div className="notifications-page">

      <div className="notifications-header">

        <div>
          <p className="notifications-eyebrow">
            UPDATES
          </p>

          <h1>Notifications</h1>

          <p>
            Stay updated with your neighbourhood activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            className="notifications-read-button"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}

      </div>


      <div className="notifications-summary">

        <div className="notifications-summary-card">
          <span>Unread</span>
          <strong>{unreadCount}</strong>
          <small>Need your attention</small>
        </div>

        <div className="notifications-summary-card">
          <span>Total</span>
          <strong>{notifications.length}</strong>
          <small>All notifications</small>
        </div>

      </div>


      <section className="notifications-card">

        <div className="notifications-card-header">
          <div>
            <h2>Recent Notifications</h2>
            <p>
              Your latest activity and updates.
            </p>
          </div>
        </div>


        <div className="notifications-list">

          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={
                notification.unread
                  ? "notification-item unread"
                  : "notification-item"
              }
            >

              <div
                className={`notification-icon notification-icon-${notification.type}`}
              >
                {getIcon(notification.type)}
              </div>


              <div className="notification-content">

                <div className="notification-title-row">

                  <h3>
                    {notification.title}
                  </h3>

                  {notification.unread && (
                    <span className="notification-unread-dot" />
                  )}

                </div>

                <p>
                  {notification.message}
                </p>

                <span className="notification-time">
                  {notification.time}
                </span>

              </div>

            </div>
          ))}

        </div>

      </section>

    </div>
  );
}

export default Notifications;