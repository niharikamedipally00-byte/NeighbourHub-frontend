// src/pages/owner/OwnerDashboard.jsx

import { useNavigate } from "react-router-dom";

function OwnerDashboard() {
  const navigate = useNavigate();

  let user = null;

  try {
    const storedUser = localStorage.getItem(
      "neighbourhub_user"
    );

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch {
    user = null;
  }

  return (
    <div className="owner-dashboard">

      {/* HEADER */}

      <section className="owner-dashboard-header">

        <div>

          <p className="owner-eyebrow">
            SHOP OWNER
          </p>

          <h1>
            Welcome back,
            <br />
            {user?.name || "Shop Owner"}.
          </h1>

          <p>
            Manage your local shop, products
            and customer orders from one place.
          </p>

        </div>

        <button
          type="button"
          className="owner-primary-button"
          onClick={() =>
            navigate("/owner/shop")
          }
        >
          Manage My Shop
        </button>

      </section>


      {/* STATS */}

      <section className="owner-stats-grid">

        <div className="owner-stat-card">

          <span className="owner-stat-label">
            My Shop
          </span>

          <strong>
            1
          </strong>

          <small>
            Registered shop
          </small>

        </div>


        <div className="owner-stat-card">

          <span className="owner-stat-label">
            Products
          </span>

          <strong>
            —
          </strong>

          <small>
            Manage your catalogue
          </small>

        </div>


        <div className="owner-stat-card">

          <span className="owner-stat-label">
            Orders
          </span>

          <strong>
            —
          </strong>

          <small>
            Customer orders
          </small>

        </div>


        <div className="owner-stat-card">

          <span className="owner-stat-label">
            Status
          </span>

          <strong className="owner-status-active">
            Active
          </strong>

          <small>
            Your account status
          </small>

        </div>

      </section>


      {/* QUICK MANAGEMENT */}

      <section className="owner-dashboard-section">

        <div className="owner-section-header">

          <div>

            <p className="owner-eyebrow">
              MANAGEMENT
            </p>

            <h2>
              Manage your business
            </h2>

            <p>
              Everything you need to run your
              shop on NeighbourHub.
            </p>

          </div>

        </div>


        <div className="owner-management-grid">

          <button
            type="button"
            className="owner-management-card"
            onClick={() =>
              navigate("/owner/shop")
            }
          >

            <div className="owner-card-icon">
              SHOP
            </div>

            <div>

              <h3>
                My Shop
              </h3>

              <p>
                View and manage your shop
                information.
              </p>

            </div>

            <span>
              →
            </span>

          </button>


          <button
            type="button"
            className="owner-management-card"
            onClick={() =>
              navigate("/owner/products")
            }
          >

            <div className="owner-card-icon">
              PR
            </div>

            <div>

              <h3>
                Products
              </h3>

              <p>
                Add, edit and manage products
                in your catalogue.
              </p>

            </div>

            <span>
              →
            </span>

          </button>


          <button
            type="button"
            className="owner-management-card"
            onClick={() =>
              navigate("/owner/orders")
            }
          >

            <div className="owner-card-icon">
              ORD
            </div>

            <div>

              <h3>
                Orders
              </h3>

              <p>
                View and manage customer orders.
              </p>

            </div>

            <span>
              →
            </span>

          </button>


          <button
            type="button"
            className="owner-management-card"
            onClick={() =>
              navigate("/owner/products/create")
            }
          >

            <div className="owner-card-icon">
              +
            </div>

            <div>

              <h3>
                Add Product
              </h3>

              <p>
                Add a new product to your shop.
              </p>

            </div>

            <span>
              →
            </span>

          </button>

        </div>

      </section>


      {/* BUSINESS CTA */}

      <section className="owner-dashboard-cta">

        <div>

          <p className="owner-eyebrow">
            GROW YOUR LOCAL BUSINESS
          </p>

          <h2>
            Keep your catalogue updated.
          </h2>

          <p>
            Add products with prices and
            availability so customers can
            discover and order from you.
          </p>

        </div>

        <button
          type="button"
          className="owner-primary-button"
          onClick={() =>
            navigate("/owner/products/create")
          }
        >
          Add New Product
        </button>

      </section>

    </div>
  );
}

export default OwnerDashboard;