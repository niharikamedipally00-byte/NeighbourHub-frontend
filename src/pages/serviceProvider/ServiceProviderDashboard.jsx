import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://neighbourhub-backend-uns0.onrender.com";

function ServiceProviderDashboard() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("neighbourhub_token");

  let user = null;

  try {
    const storedUser = localStorage.getItem("neighbourhub_user");
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch {
    user = null;
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const serviceResponse = await fetch(
        `${API_URL}/api/services`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (serviceResponse.ok) {
        const serviceData = await serviceResponse.json();

        const allServices = Array.isArray(serviceData)
          ? serviceData
          : serviceData.services || [];

        const myServices = allServices.filter((service) => {
          const providerId =
            service.providerId ??
            service.userId ??
            service.provider?.id;

          return String(providerId) === String(user?.id);
        });

        setServices(myServices);
      }

      const requestResponse = await fetch(
        `${API_URL}/api/service-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (requestResponse.ok) {
        const requestData = await requestResponse.json();

        const allRequests = Array.isArray(requestData)
          ? requestData
          : requestData.requests || [];

        setRequests(allRequests);
      }
    } catch {
      setServices([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  const pendingRequests = requests.filter((request) =>
    ["PENDING", "REQUESTED"].includes(
      String(request.status || "").toUpperCase()
    )
  ).length;

  const completedRequests = requests.filter((request) =>
    ["COMPLETED", "DONE"].includes(
      String(request.status || "").toUpperCase()
    )
  ).length;

  return (
    <div className="service-provider-dashboard">
      <div className="service-provider-header">
        <div>
          <span className="service-provider-label">
            SERVICE PROVIDER
          </span>

          <h1>
            Welcome, {user?.name || "Service Provider"}
          </h1>

          <p>
            Manage your local services and customer requests
            from one place.
          </p>
        </div>

        <button
          type="button"
          className="service-provider-primary-button"
          onClick={() =>
            navigate("/service-provider/services/create")
          }
        >
          + Add Service
        </button>
      </div>

      <div className="service-provider-stats">
        <div className="service-provider-stat-card">
          <span>My Services</span>
          <strong>
            {loading ? "..." : services.length}
          </strong>
        </div>

        <div className="service-provider-stat-card">
          <span>Pending Requests</span>
          <strong>
            {loading ? "..." : pendingRequests}
          </strong>
        </div>

        <div className="service-provider-stat-card">
          <span>Completed Jobs</span>
          <strong>
            {loading ? "..." : completedRequests}
          </strong>
        </div>

        <div className="service-provider-stat-card">
          <span>Status</span>
          <strong className="service-provider-active">
            Active
          </strong>
        </div>
      </div>

      <div className="service-provider-section">
        <div className="service-provider-section-header">
          <div>
            <h2>Quick Management</h2>
            <p>Manage your services and requests.</p>
          </div>
        </div>

        <div className="service-provider-management-grid">
          <button
            type="button"
            className="service-provider-management-card"
            onClick={() =>
              navigate("/service-provider/services")
            }
          >
            <div className="service-provider-card-icon">
              S
            </div>

            <div>
              <h3>My Services</h3>
              <p>
                View and manage the services you provide.
              </p>
            </div>

            <span>→</span>
          </button>

          <button
            type="button"
            className="service-provider-management-card"
            onClick={() =>
              navigate("/service-provider/requests")
            }
          >
            <div className="service-provider-card-icon">
              R
            </div>

            <div>
              <h3>Service Requests</h3>
              <p>
                View customer requests and update their
                status.
              </p>
            </div>

            <span>→</span>
          </button>

          <button
            type="button"
            className="service-provider-management-card"
            onClick={() =>
              navigate("/service-provider/services/create")
            }
          >
            <div className="service-provider-card-icon">
              +
            </div>

            <div>
              <h3>Add New Service</h3>
              <p>
                List another service for nearby customers.
              </p>
            </div>

            <span>→</span>
          </button>
        </div>
      </div>

      <div className="service-provider-bottom-grid">
        <div className="service-provider-panel">
          <div className="service-provider-panel-header">
            <div>
              <h2>My Services</h2>
              <p>Your currently listed services.</p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/service-provider/services")
              }
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="service-provider-empty">
              Loading services...
            </div>
          ) : services.length === 0 ? (
            <div className="service-provider-empty">
              <strong>No services listed yet.</strong>
              <span>
                Add your first service to start receiving
                requests.
              </span>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/service-provider/services/create"
                  )
                }
              >
                Add Service
              </button>
            </div>
          ) : (
            <div className="service-provider-list">
              {services.slice(0, 5).map((service) => (
                <div
                  className="service-provider-list-item"
                  key={service.id}
                >
                  <div>
                    <strong>
                      {service.name ||
                        service.title ||
                        "Service"}
                    </strong>

                    <span>
                      {service.category ||
                        "Local Service"}
                    </span>
                  </div>

                  <span className="service-provider-list-status">
                    {service.available === false
                      ? "Unavailable"
                      : "Available"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="service-provider-panel">
          <div className="service-provider-panel-header">
            <div>
              <h2>Recent Requests</h2>
              <p>Latest customer requests.</p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/service-provider/requests")
              }
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="service-provider-empty">
              Loading requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="service-provider-empty">
              <strong>No service requests yet.</strong>
              <span>
                Customer requests will appear here.
              </span>
            </div>
          ) : (
            <div className="service-provider-list">
              {requests.slice(0, 5).map((request, index) => (
                <div
                  className="service-provider-list-item"
                  key={request.id || index}
                >
                  <div>
                    <strong>
                      {request.serviceName ||
                        request.service?.name ||
                        "Service Request"}
                    </strong>

                    <span>
                      {request.customerName ||
                        request.user?.name ||
                        "Customer"}
                    </span>
                  </div>

                  <span className="service-provider-request-status">
                    {request.status || "PENDING"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="service-provider-cta">
        <div>
          <span>GROW YOUR LOCAL BUSINESS</span>

          <h2>
            Make your services easier to discover.
          </h2>

          <p>
            Keep your service information updated so nearby
            customers can find and contact you.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/service-provider/services/create")
          }
        >
          Add a Service
        </button>
      </div>
    </div>
  );
}

export default ServiceProviderDashboard;