// src/pages/owner/EditProduct.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  updateProduct,
} from "../../services/productService";

function EditProduct() {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    available: true,
    stockQuantity: "",
  });

  const [shopId, setShopId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      const token = localStorage.getItem(
        "neighbourhub_token"
      );

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const product =
          await getProductById(
            productId,
            token
          );

        setForm({
          name: product.name || "",
          description:
            product.description || "",
          price:
            product.price ?? "",
          category:
            product.category || "",
          imageUrl:
            product.imageUrl || "",
          available:
            product.available !== false,
          stockQuantity:
            product.stockQuantity ?? "",
        });

        setShopId(
          product.shopId ??
            product.shop?.id ??
            null
        );
      } catch (err) {
        console.error(
          "Product loading error:",
          err
        );

        setError(
          err.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, navigate]);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem(
      "neighbourhub_token"
    );

    if (!token) {
      navigate("/login");
      return;
    }

    if (!form.name.trim()) {
      setError(
        "Product name is required."
      );
      return;
    }

    if (
      !form.price ||
      Number(form.price) <= 0
    ) {
      setError(
        "Enter a valid product price."
      );
      return;
    }

    if (
      form.stockQuantity === "" ||
      Number(form.stockQuantity) < 0
    ) {
      setError(
        "Enter a valid stock quantity."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const productData = {
        name: form.name.trim(),
        description:
          form.description.trim(),
        price: Number(form.price),
        category:
          form.category.trim(),
        imageUrl:
          form.imageUrl.trim() || null,
        available:
          Boolean(form.available),
        stockQuantity: Number(
          form.stockQuantity
        ),
        shopId,
      };

      await updateProduct(
        productId,
        productData,
        token
      );

      navigate("/owner/products");
    } catch (err) {
      console.error(
        "Update product error:",
        err
      );

      setError(
        err.message ||
          "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="owner-page-state">
        <div className="owner-loading-mark">
          ...
        </div>

        <h2>
          Loading product...
        </h2>
      </div>
    );
  }

  return (
    <div className="owner-create-product-page">

      <section className="owner-page-header">

        <div>
          <p className="owner-eyebrow">
            PRODUCT CATALOGUE
          </p>

          <h1>
            Edit Product
          </h1>

          <p>
            Update your product information,
            price and availability.
          </p>
        </div>

        <button
          type="button"
          className="owner-secondary-button"
          onClick={() =>
            navigate(
              "/owner/products"
            )
          }
        >
          ← Back to Products
        </button>

      </section>


      {error && (
        <div className="owner-products-error">
          {error}
        </div>
      )}


      <form
        className="owner-product-form"
        onSubmit={handleSubmit}
      >

        <div className="owner-form-main">

          <section className="owner-form-card">

            <div className="owner-form-card-header">

              <p className="owner-card-eyebrow">
                BASIC INFORMATION
              </p>

              <h2>
                Product details
              </h2>

            </div>


            <div className="owner-form-field">

              <label htmlFor="name">
                Product name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Product name"
                value={form.name}
                onChange={handleChange}
                required
              />

            </div>


            <div className="owner-form-field">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                placeholder="Describe your product..."
                value={
                  form.description
                }
                onChange={handleChange}
              />

            </div>


            <div className="owner-form-two-columns">

              <div className="owner-form-field">

                <label htmlFor="category">
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="Category"
                  value={
                    form.category
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <div className="owner-form-field">

                <label htmlFor="price">
                  Price (₹)
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={
                    form.price
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

            </div>

          </section>


          <section className="owner-form-card">

            <div className="owner-form-card-header">

              <p className="owner-card-eyebrow">
                INVENTORY
              </p>

              <h2>
                Stock & availability
              </h2>

            </div>


            <div className="owner-form-two-columns">

              <div className="owner-form-field">

                <label htmlFor="stockQuantity">
                  Stock quantity
                </label>

                <input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={
                    form.stockQuantity
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              <div className="owner-availability-toggle">

                <label>
                  <input
                    type="checkbox"
                    name="available"
                    checked={
                      form.available
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <span>
                    Product available
                  </span>
                </label>

                <small>
                  Customers can order this
                  product when enabled.
                </small>

              </div>

            </div>

          </section>


          <section className="owner-form-card">

            <div className="owner-form-card-header">

              <p className="owner-card-eyebrow">
                PRODUCT IMAGE
              </p>

              <h2>
                Image
              </h2>

            </div>


            <div className="owner-form-field">

              <label htmlFor="imageUrl">
                Image URL
              </label>

              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://example.com/product.jpg"
                value={
                  form.imageUrl
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </section>

        </div>


        <aside className="owner-form-sidebar">

          <div className="owner-form-side-card">

            <p className="owner-card-eyebrow">
              PRODUCT
            </p>

            <div className="owner-product-preview">

              <div className="owner-preview-image">

                {form.imageUrl ? (
                  <img
                    src={
                      form.imageUrl
                    }
                    alt={
                      form.name ||
                      "Product"
                    }
                  />
                ) : (
                  form.name
                    ? form.name
                        .substring(
                          0,
                          1
                        )
                        .toUpperCase()
                    : "P"
                )}

              </div>

              <strong>
                {form.name ||
                  "Product name"}
              </strong>

              <span>
                {form.category ||
                  "Category"}
              </span>

              <b>
                ₹
                {form.price
                  ? Number(
                      form.price
                    ).toFixed(2)
                  : "0.00"}
              </b>

            </div>

          </div>


          <button
            type="submit"
            className="owner-primary-button owner-save-product-button"
            disabled={saving}
          >
            {saving
              ? "Updating Product..."
              : "Update Product"}
          </button>


          <button
            type="button"
            className="owner-secondary-button owner-cancel-product-button"
            onClick={() =>
              navigate(
                "/owner/products"
              )
            }
          >
            Cancel
          </button>

        </aside>

      </form>

    </div>
  );
}

export default EditProduct;