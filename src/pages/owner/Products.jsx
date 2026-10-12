// src/pages/owner/Products.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllProducts,
  deleteProduct,
} from "../../services/productService";
import { getAllShops } from "../../services/shopService";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const loadProducts = async () => {
    const token = localStorage.getItem(
      "neighbourhub_token"
    );

    const storedUser =
      localStorage.getItem(
        "neighbourhub_user"
      );

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const user = JSON.parse(storedUser);

      const [productData, shops] =
        await Promise.all([
          getAllProducts(token),
          getAllShops(token),
        ]);

      const ownerShops = Array.isArray(shops)
        ? shops.filter((item) => {
            const ownerId =
              item.ownerId ??
              item.userId ??
              item.owner?.id;

            return (
              ownerId != null &&
              String(ownerId) ===
                String(user.id)
            );
          })
        : [];

      const ownerShopIds =
        ownerShops.map((item) =>
          String(item.id)
        );

      const ownerProducts =
        Array.isArray(productData)
          ? productData.filter((item) => {
              const shopId =
                item.shopId ??
                item.shop?.id;

              return ownerShopIds.includes(
                String(shopId)
              );
            })
          : [];

      setShop(
        ownerShops.length > 0
          ? ownerShops[0]
          : null
      );

      setProducts(ownerProducts);
    } catch (err) {
      console.error(
        "Owner products error:",
        err
      );

      setError(
        err.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category)
      .filter(Boolean);

    return [
      "All",
      ...Array.from(
        new Set(values)
      ),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        String(product.name || "")
          .toLowerCase()
          .includes(query) ||
        String(
          product.description || ""
        )
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [products, search, category]);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem(
      "neighbourhub_token"
    );

    try {
      setDeletingId(productId);
      setError("");

      await deleteProduct(
        productId,
        token
      );

      setProducts((current) =>
        current.filter(
          (product) =>
            product.id !== productId
        )
      );
    } catch (err) {
      console.error(
        "Delete product error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price) => {
    return Number(price || 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="owner-page-state">
        <div className="owner-loading-mark">
          ...
        </div>
        <h2>
          Loading products...
        </h2>
      </div>
    );
  }

  return (
    <div className="owner-products-page">

      <section className="owner-page-header">

        <div>
          <p className="owner-eyebrow">
            PRODUCT CATALOGUE
          </p>

          <h1>
            Products
          </h1>

          <p>
            Manage the products available
            in your local shop.
          </p>
        </div>

        <button
          type="button"
          className="owner-primary-button"
          onClick={() =>
            navigate(
              "/owner/products/create"
            )
          }
        >
          + Add Product
        </button>

      </section>


      {shop && (
        <div className="owner-products-shop-bar">

          <div>
            <span>
              SHOP
            </span>

            <strong>
              {shop.name}
            </strong>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/owner/shop")
            }
          >
            View Shop →
          </button>

        </div>
      )}


      {error && (
        <div className="owner-products-error">
          {error}
        </div>
      )}


      <section className="owner-products-toolbar">

        <div className="owner-product-search">

          <span>
            Search
          </span>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>


        <div className="owner-product-filters">

          {categories.map(
            (item) => (
              <button
                type="button"
                key={item}
                className={
                  category === item
                    ? "owner-product-filter active"
                    : "owner-product-filter"
                }
                onClick={() =>
                  setCategory(item)
                }
              >
                {item}
              </button>
            )
          )}

        </div>

      </section>


      <section className="owner-products-summary">

        <div>
          <strong>
            {products.length}
          </strong>

          <span>
            Total products
          </span>
        </div>

        <div>
          <strong>
            {
              products.filter(
                (item) =>
                  item.available
              ).length
            }
          </strong>

          <span>
            Available
          </span>
        </div>

        <div>
          <strong>
            {
              products.filter(
                (item) =>
                  !item.available
              ).length
            }
          </strong>

          <span>
            Unavailable
          </span>
        </div>

      </section>


      {filteredProducts.length === 0 ? (
        <section className="owner-products-empty">

          <div className="owner-empty-product-icon">
            PR
          </div>

          <h2>
            {products.length === 0
              ? "No products yet"
              : "No products found"}
          </h2>

          <p>
            {products.length === 0
              ? "Add your first product to start selling through NeighbourHub."
              : "Try another search or category."}
          </p>

          {products.length === 0 && (
            <button
              type="button"
              className="owner-primary-button"
              onClick={() =>
                navigate(
                  "/owner/products/create"
                )
              }
            >
              Add Your First Product
            </button>
          )}

        </section>
      ) : (
        <section className="owner-products-grid">

          {filteredProducts.map(
            (product) => (
              <article
                className="owner-product-card"
                key={product.id}
              >

                <div className="owner-product-image">

                  {product.imageUrl ? (
                    <img
                      src={
                        product.imageUrl
                      }
                      alt={
                        product.name
                      }
                    />
                  ) : (
                    <span>
                      {product.name
                        ?.substring(
                          0,
                          1
                        )
                        .toUpperCase() ||
                        "P"}
                    </span>
                  )}

                </div>


                <div className="owner-product-card-content">

                  <div className="owner-product-top">

                    <div>

                      <span className="owner-product-category">
                        {product.category ||
                          "Product"}
                      </span>

                      <h3>
                        {product.name}
                      </h3>

                    </div>

                    <span
                      className={
                        product.available
                          ? "owner-availability available"
                          : "owner-availability unavailable"
                      }
                    >
                      {product.available
                        ? "Available"
                        : "Unavailable"}
                    </span>

                  </div>


                  <p className="owner-product-description">
                    {product.description ||
                      "No description added."}
                  </p>


                  <div className="owner-product-details">

                    <strong>
                      ₹
                      {formatPrice(
                        product.price
                      )}
                    </strong>

                    <span>
                      Stock:{" "}
                      {product.stockQuantity ??
                        0}
                    </span>

                  </div>


                  <div className="owner-product-actions">

                    <button
                      type="button"
                      className="owner-edit-product-button"
                      onClick={() =>
                        navigate(
                          `/owner/products/edit/${product.id}`
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="owner-delete-product-button"
                      disabled={
                        deletingId ===
                        product.id
                      }
                      onClick={() =>
                        handleDelete(
                          product.id
                        )
                      }
                    >
                      {deletingId ===
                      product.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>

                </div>

              </article>
            )
          )}

        </section>
      )}

    </div>
  );
}

export default Products;