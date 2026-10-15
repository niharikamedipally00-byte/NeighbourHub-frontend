import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "https://neighbourhub-backend-uns0.onrender.com";

function EditService() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    phone: "",
    location: "",
    available: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("neighbourhub_token");

  useEffect(() => {
    loadService();
  }, [serviceId]);

  async function loadService() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/services/${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load service"
        );
      }

      setFormData({
        name: data.name || data.title || "",
        description: data.description || "",
        category: data.category || "",
        price:
          data.price !== null && data.price !== undefined
            ? data.price
            : "",
        phone: data.phone || "",
        location: data.location || "",
        available:
          data.available === undefined
            ? true
            : data.available,
      });
    } catch (err) {
      setError(
        err.message || "Unable to load service"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Service name is required.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        title: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        price:
          formData.price === ""
            ? null
            : Number(formData.price),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        available: formData.available,
      };

      const response = await fetch(
        `${API_URL}/api/services/${serviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update service"
        );
      }

      navigate("/service-provider/services");
    } catch (err) {
      setError(
        err.message || "Unable to update service"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="provider-form-page">
        <div className="provider-form-loading">
          Loading service...
        </div>
      </div>
    );
  }

  return (
    <div className="provider-form-page">
      <div className="provider-form-header">
        <div>
          <span className="provider-section-label">
            SERVICE MANAGEMENT
          </span>

          <h1>Edit Service</h1>

          <p>
            Update your service information and
            availability.
          </p>
        </div>

        <button
          type="button"
          className="provider-secondary-button"
          onClick={() =>
            navigate("/service-provider/services")
          }
        >
          Back to Services
        </button>
      </div>

      {error && (
        <div className="provider-form-error">
          {error}
        </div>
      )}

      <form
        className="provider-form-card"
        onSubmit={handleSubmit}
      >
        <div className="provider-form-section">
          <div className="provider-form-section-title">
            Basic Information
          </div>

          <div className="provider-form-grid">
            <div className="provider-form-field provider-form-full">
              <label htmlFor="name">
                Service Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Home Plumbing"
              />
            </div>

            <div className="provider-form-field">
              <label htmlFor="category">
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                placeholder="Example: Plumbing"
              />
            </div>

            <div className="provider-form-field">
              <label htmlFor="price">
                Price
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="Example: 500"
              />
            </div>

            <div className="provider-form-field provider-form-full">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your service..."
              />
            </div>
          </div>
        </div>

        <div className="provider-form-section">
          <div className="provider-form-section-title">
            Contact & Location
          </div>

          <div className="provider-form-grid">
            <div className="provider-form-field">
              <label htmlFor="phone">
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your contact number"
              />
            </div>

            <div className="provider-form-field">
              <label htmlFor="location">
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="Service location"
              />
            </div>
          </div>
        </div>

        <div className="provider-form-section">
          <label className="provider-availability-row">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />

            <span>
              <strong>Service Available</strong>
              <small>
                Customers can request this service.
              </small>
            </span>
          </label>
        </div>

        <div className="provider-form-actions">
          <button
            type="button"
            className="provider-cancel-button"
            onClick={() =>
              navigate("/service-provider/services")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="provider-primary-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditService;