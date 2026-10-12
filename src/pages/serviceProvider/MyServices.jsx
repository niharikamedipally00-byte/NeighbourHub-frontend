import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

function MyServices() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

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
    loadServices();
  }, []);

  async function loadServices() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/services`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load services"
        );
      }

      const allServices = Array.isArray(data)
        ? data
        : data.services || [];

      const myServices = allServices.filter((service) => {
        const providerId =
          service.providerId ??
          service.userId ??
          service.provider?.id;

        return String(providerId) === String(user?.id);
      });

      setServices(myServices);
    } catch (err) {
      setError(err.message || "Unable to load services");
    } finally {
      setLoading(false);
    }
  }

  async function deleteService(serviceId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(serviceId);
      setError("");

      const response = await fetch(
        `${API_URL}/api/services/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete service"
        );
      }

      setServices((currentServices) =>
        currentServices.filter(
          (service) =>
            String(service.id) !== String(serviceId)
        )
      );
    } catch (err) {
      setError(err.message || "Unable to delete service");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredServices = services.filter((service) => {
    const text = `
      ${service.name || ""}
      ${service.title || ""}
      ${service.category || ""}
      ${service.description || ""}
      ${service.location || ""}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="provider-services-page">
      <div className="provider-services-header">
        <div>
          <span className="provider-section-label">
            MY SERVICES
          </span>

          <h1>My Services</h1>

          <p>
            Manage the services you provide to nearby
            customers.
          </p>
        </div>

        <div className="provider-services-header-actions">
          <button
            type="button"
            className="provider-secondary-button"
            onClick={() =>
              navigate("/service-provider/dashboard")
            }
          >
            Dashboard
          </button>

          <button
            type="button"
            className="provider-primary-button"
            onClick={() =>
              navigate(
                "/service-provider/services/create"
              )
            }
          >
            + Add Service
          </button>
        </div>
      </div>

      {error && (
        <div className="provider-services-error">
          {error}
        </div>
      )}

      <div className="provider-services-toolbar">
        <div className="provider-service-search">
          <input
            type="text"
            placeholder="Search your services..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="provider-service-count">
          {filteredServices.length} service
          {filteredServices.length !== 1 ? "s" : ""}
        </div>
      </div>

      {loading ? (
        <div className="provider-services-state">
          <div className="provider-state-icon">...</div>
          <h3>Loading services...</h3>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="provider-services-state">
          <div className="provider-state-icon">+</div>

          <h3>
            {search
              ? "No services found"
              : "No services added yet"}
          </h3>

          <p>
            {search
              ? "Try a different search term."
              : "Add your first service so nearby customers can find you."}
          </p>

          {!search && (
            <button
              type="button"
              className="provider-primary-button"
              onClick={() =>
                navigate(
                  "/service-provider/services/create"
                )
              }
            >
              Add Your First Service
            </button>
          )}
        </div>
      ) : (
        <div className="provider-services-grid">
          {filteredServices.map((service) => {
            const available =
              service.available !== false &&
              service.active !== false;

            return (
              <div
                className="provider-service-card"
                key={service.id}
              >
                <div className="provider-service-card-top">
                  <div className="provider-service-icon">
                    {service.name ||
                    service.title
                      ? String(
                          service.name ||
                            service.title
                        )
                          .charAt(0)
                          .toUpperCase()
                      : "S"}
                  </div>

                  <span
                    className={
                      available
                        ? "provider-service-status available"
                        : "provider-service-status unavailable"
                    }
                  >
                    {available
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </div>

                <div className="provider-service-card-content">
                  <span className="provider-service-category">
                    {service.category ||
                      "Local Service"}
                  </span>

                  <h2>
                    {service.name ||
                      service.title ||
                      "Service"}
                  </h2>

                  <p>
                    {service.description ||
                      "No description added for this service."}
                  </p>

                  <div className="provider-service-details">
                    {service.price !== undefined &&
                      service.price !== null && (
                        <div>
                          <span>Starting Price</span>
                          <strong>
                            ₹
                            {Number(
                              service.price
                            ).toFixed(2)}
                          </strong>
                        </div>
                      )}

                    {service.location && (
                      <div>
                        <span>Location</span>
                        <strong>
                          {service.location}
                        </strong>
                      </div>
                    )}

                    {service.phone && (
                      <div>
                        <span>Contact</span>
                        <strong>
                          {service.phone}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="provider-service-card-actions">
                  <button
                    type="button"
                    className="provider-edit-button"
                    onClick={() =>
                      navigate(
                        `/service-provider/services/edit/${service.id}`
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="provider-delete-button"
                    disabled={
                      deletingId === service.id
                    }
                    onClick={() =>
                      deleteService(service.id)
                    }
                  >
                    {deletingId === service.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyServices;