// src/pages/owner/CreateShop.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateShop() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    phone: "",
    city: "Hyderabad",
    address: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/owner/shop");
  };

  return (
    <div className="owner-form-page">
      <div className="owner-form-header">
        <div>
          <p className="owner-eyebrow">BUSINESS SETUP</p>
          <h1>Create Your Shop</h1>
          <p>Add your business details so customers can discover you.</p>
        </div>
      </div>

      <form className="owner-form-card" onSubmit={handleSubmit}>
        <div className="owner-form-section">
          <h2>Basic Information</h2>
          <p>Enter the main details of your shop.</p>

          <div className="owner-form-grid">
            <div className="owner-form-field">
              <label>Shop Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter shop name"
                required
              />
            </div>

            <div className="owner-form-field">
              <label>Business Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="Grocery">Grocery</option>
                <option value="Meat">Meat</option>
                <option value="Dairy">Dairy</option>
                <option value="Clothing">Clothing</option>
                <option value="Electronics">Electronics</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="owner-form-field">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="owner-form-field">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>
          </div>
        </div>

        <div className="owner-form-divider" />

        <div className="owner-form-section">
          <h2>Location</h2>
          <p>Help customers find your shop easily.</p>

          <div className="owner-form-field">
            <label>Shop Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter complete shop address"
              rows="4"
              required
            />
          </div>
        </div>

        <div className="owner-form-divider" />

        <div className="owner-form-section">
          <h2>About Your Shop</h2>
          <p>Tell customers what your business offers.</p>

          <div className="owner-form-field">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your shop and products..."
              rows="5"
            />
          </div>
        </div>

        <div className="owner-form-actions">
          <button
            type="button"
            className="owner-cancel-button"
            onClick={() => navigate("/owner/shop")}
          >
            Cancel
          </button>

          <button type="submit" className="owner-primary-button">
            Create Shop
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateShop;