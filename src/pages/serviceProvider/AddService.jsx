import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

function AddService() {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setLoading(true);

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
        providerId: user?.id,
        userId: user?.id,
      };

      const response = await fetch(
        `${API_URL}/api/services`,
        {
          method: "POST",
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
          data.message || "Unable to create service"
        );
      }

      navigate("/service-provider/services");
    } catch (err) {
      setError(
        err.message || "Unable to create service"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="provider-form-page">
      <div className="provider-form-header">
        <div>
          <span className="provider-section-label">
            NEW SERVICE
          </span>

          <h1>Add Service</h1>

          <p>
            Add a service so nearby customers can discover
            you.
          </p>
        </div>

        <button
          type="button"
          className="provider-secondary-button"
          onClick={() =>
            navigate("/service-provider/services")
          }
        >
          Back
        </button>
      </div>

      <div className="provider-form-card">
        {error && (
          <div className="provider-form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="provider-form-section">
            <h2>Service Information</h2>

            <p>
              Enter the basic information customers will see.
            </p>
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
                placeholder="Example: Plumbing Services"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="provider-form-field">
              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">
                  Select category
                </option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">
                  Electrician
                </option>
                <option value="Carpenter">
                  Carpenter
                </option>
                <option value="Mechanic">
                  Mechanic
                </option>
                <option value="Cleaning">
                  Cleaning
                </option>
                <option value="Beauty">
                  Beauty
                </option>
                <option value="Repair">
                  Repair
                </option>
                <option value="Painting">
                  Painting
                </option>
                <option value="Home Services">
                  Home Services
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="provider-form-field">
              <label htmlFor="price">
                Starting Price
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Example: 300"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div className="provider-form-field">
              <label htmlFor="phone">
                Contact Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Example: 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="provider-form-field">
              <label htmlFor="location">
                Service Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="Example: Hyderabad"
                value={formData.location}
                onChange={handleChange}
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
                placeholder="Describe the service you provide..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="provider-availability-box provider-form-full">
              <label className="provider-checkbox-label">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                />

                <span>
                  <strong>Service Available</strong>
                  <small>
                    Customers can currently request this
                    service.
                  </small>
                </span>
              </label>
            </div>
          </div>

          <div className="provider-form-actions">
            <button
              type="button"
              className="provider-cancel-button"
              onClick={() =>
                navigate("/service-provider/services")
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="provider-primary-button"
              disabled={loading}
            >
              {loading
                ? "Adding Service..."
                : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddService;