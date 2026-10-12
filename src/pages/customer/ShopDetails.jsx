import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getShopById } from "../../services/shopService";
import { getProductsByShop } from "../../services/productService";
import { addToCart } from "../../services/cartService";

function ShopDetails() {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [addingProductId, setAddingProductId] = useState(null);

  useEffect(() => {
    const loadShop = async () => {
      const token = localStorage.getItem("neighbourhub_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setProductsLoading(true);
        setError("");

        const shopData = await getShopById(shopId, token);
        setShop(shopData);

        try {
          const productData = await getProductsByShop(
            shopId,
            token
          );

          console.log("SHOP PRODUCTS:", productData);

          setProducts(
            Array.isArray(productData)
              ? productData
              : []
          );
        } catch (productError) {
          console.error(
            "PRODUCT LOAD ERROR:",
            productError
          );

          setProducts([]);
        } finally {
          setProductsLoading(false);
        }
      } catch (err) {
        console.error("SHOP LOAD ERROR:", err);

        setError(
          err.message || "Unable to load shop."
        );
      } finally {
        setLoading(false);
      }
    };

    loadShop();
  }, [shopId, navigate]);

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category?.trim())
      .filter(Boolean);

    return ["ALL", ...new Set(values)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.description
          ?.toLowerCase()
          .includes(query);

      const matchesCategory =
        categoryFilter === "ALL" ||
        product.category?.toLowerCase() ===
          categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem(
        "neighbourhub_token"
      );

      if (!token) {
        navigate("/login");
        return;
      }

      setAddingProductId(productId);
      setCartMessage("");
      setError("");

      await addToCart(productId, 1, token);

      setCartMessage("Product added to your cart.");

      setTimeout(() => {
        setCartMessage("");
      }, 2500);
    } catch (err) {
      console.error("ADD CART ERROR:", err);

      setError(
        err.message || "Unable to add product to cart."
      );
    } finally {
      setAddingProductId(null);
    }
  };

  if (loading) {
    return (
      <div className="shop-details-page">
        <div className="page-state">
          <span className="eyebrow">SHOP</span>
          <h2>Loading shop...</h2>
          <p>
            We're retrieving the shop information.
          </p>
        </div>
      </div>
    );
  }

  if (error && !shop) {
    return (
      <div className="shop-details-page">
        <div className="details-error">
          <div className="empty-state-mark">
            SHOP
          </div>

          <span className="eyebrow">
            SHOP DETAILS
          </span>

          <h2>Unable to load shop</h2>

          <p>{error}</p>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/explore")}
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  if (!shop) {
    return null;
  }

  return (
    <div className="shop-details-page">

      {/* HEADER */}

      <section className="page-header">

        <div>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/explore")}
          >
            ← Back to Explore
          </button>

          <span className="eyebrow">
            LOCAL SHOP
          </span>

          <h1>{shop.name}</h1>

          <p>
            {shop.description ||
              "A local business serving your neighbourhood."}
          </p>

        </div>

        <div className="page-header-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/cart")}
          >
            View Cart
          </button>

        </div>

      </section>


      {/* SHOP HERO */}

      <section className="shop-details-hero">

        <div className="shop-details-logo">
          {shop.name
            ?.substring(0, 2)
            .toUpperCase() || "SH"}
        </div>

        <div className="shop-details-main">

          <div className="shop-details-title-row">

            <div>

              <span className="category">
                {shop.category || "Local Shop"}
              </span>

              <h2>{shop.name}</h2>

              <p>
                {shop.description ||
                  "A trusted local business in your neighbourhood."}
              </p>

            </div>

            <span
              className={
                shop.open
                  ? "shop-detail-status open"
                  : "shop-detail-status closed"
              }
            >
              {shop.open ? "Open now" : "Closed"}
            </span>

          </div>

          <div className="shop-details-meta">

            <span>
              Rating {shop.rating ?? 0}
            </span>

            <span>•</span>

            <span>
              {shop.city || "Local area"}
            </span>

          </div>

        </div>

      </section>


      {/* CART SUCCESS */}

      {cartMessage && (
        <div className="cart-success-message">

          <span>{cartMessage}</span>

          <button
            type="button"
            onClick={() => navigate("/cart")}
          >
            View Cart
          </button>

        </div>
      )}


      {error && shop && (
        <div className="form-error">
          {error}
        </div>
      )}


      <div className="shop-details-layout">

        <main>

          {/* SHOP INFORMATION */}

          <section className="details-card">

            <div className="details-card-header">

              <div>

                <span className="eyebrow">
                  SHOP INFORMATION
                </span>

                <h2>About this shop</h2>

                <p>
                  Shop information and contact
                  details.
                </p>

              </div>

            </div>

            <div className="shop-information-grid">

              <div className="shop-information-item">
                <span>ADDRESS</span>
                <strong>
                  {shop.address ||
                    "Address not provided"}
                </strong>
              </div>

              <div className="shop-information-item">
                <span>CITY</span>
                <strong>
                  {shop.city || "Not provided"}
                </strong>
              </div>

              <div className="shop-information-item">
                <span>PHONE</span>
                <strong>
                  {shop.phone || "Not provided"}
                </strong>
              </div>

              <div className="shop-information-item">
                <span>STATUS</span>
                <strong>
                  {shop.open
                    ? "Currently open"
                    : "Currently closed"}
                </strong>
              </div>

            </div>

          </section>


          {/* PRODUCTS */}

          <section className="details-card">

            <div className="details-card-header">

              <div>

                <span className="eyebrow">
                  CATALOGUE
                </span>

                <h2>Products</h2>

                <p>
                  Browse products available from
                  this local shop.
                </p>

              </div>

              <span className="coming-soon-label">
                {products.length}{" "}
                {products.length === 1
                  ? "item"
                  : "items"}
              </span>

            </div>


            {/* CONTROLS */}

            {!productsLoading &&
              products.length > 0 && (

                <div className="shop-product-controls">

                  <div className="form-field">

                    <label htmlFor="productSearch">
                      Search products
                    </label>

                    <input
                      id="productSearch"
                      type="search"
                      placeholder="Search by product name..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                    />

                  </div>

                  <div className="product-category-filters">

                    {categories.map((category) => (

                      <button
                        key={category}
                        type="button"
                        className={
                          categoryFilter === category
                            ? "filter-button active"
                            : "filter-button"
                        }
                        onClick={() =>
                          setCategoryFilter(category)
                        }
                      >
                        {category === "ALL"
                          ? "All"
                          : category}
                      </button>

                    ))}

                  </div>

                </div>

              )}


            {/* LOADING */}

            {productsLoading && (

              <div className="products-loading">

                <div className="loading-mark">
                  PR
                </div>

                <p>
                  Loading products...
                </p>

              </div>

            )}


            {/* EMPTY */}

            {!productsLoading &&
              products.length === 0 && (

                <div className="products-empty">

                  <div className="empty-state-mark">
                    PR
                  </div>

                  <h3>
                    No products available
                  </h3>

                  <p>
                    This shop has not added any
                    products yet.
                  </p>

                </div>

              )}


            {/* NO MATCH */}

            {!productsLoading &&
              products.length > 0 &&
              filteredProducts.length === 0 && (

                <div className="products-empty">

                  <div className="empty-state-mark">
                    SEARCH
                  </div>

                  <h3>
                    No matching products
                  </h3>

                  <p>
                    Try a different product name
                    or category.
                  </p>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      setSearch("");
                      setCategoryFilter("ALL");
                    }}
                  >
                    Clear Filters
                  </button>

                </div>

              )}


            {/* PRODUCT GRID */}

            {!productsLoading &&
              filteredProducts.length > 0 && (

                <div className="shop-product-grid">

                  {filteredProducts.map((product) => (

                    <article
                      className="shop-product-card"
                      key={product.id}
                    >

                      <div className="shop-product-image">

                        {product.imageUrl ? (

                          <img
                            src={product.imageUrl}
                            alt={product.name}
                          />

                        ) : (

                          <span>
                            {product.name
                              ?.substring(0, 2)
                              .toUpperCase() ||
                              "PR"}
                          </span>

                        )}

                      </div>


                      <div className="shop-product-info">

                        <span className="product-category">
                          {product.category ||
                            "Product"}
                        </span>

                        <h3>
                          {product.name}
                        </h3>

                        <p>
                          {product.description ||
                            "Available from this local shop."}
                        </p>


                        <div className="shop-product-bottom">

                          <strong>
                            ₹
                            {Number(
                              product.price || 0
                            ).toFixed(2)}
                          </strong>

                          <span
                            className={
                              product.available
                                ? "product-available"
                                : "product-unavailable"
                            }
                          >
                            {product.available
                              ? "Available"
                              : "Unavailable"}
                          </span>

                        </div>


                        {product.stockQuantity !==
                          undefined && (
                          <span className="product-stock">
                            {product.stockQuantity > 0
                              ? `${product.stockQuantity} in stock`
                              : "Out of stock"}
                          </span>
                        )}


                        <button
                          type="button"
                          className="add-to-cart-button"
                          disabled={
                            !product.available ||
                            product.stockQuantity === 0 ||
                            addingProductId ===
                              product.id
                          }
                          onClick={() =>
                            handleAddToCart(product.id)
                          }
                        >
                          {addingProductId ===
                          product.id
                            ? "Adding..."
                            : product.available &&
                              product.stockQuantity > 0
                            ? "Add to Cart"
                            : "Unavailable"}
                        </button>

                      </div>

                    </article>

                  ))}

                </div>

              )}

          </section>

        </main>


        {/* SIDEBAR */}

        <aside>

          <div className="details-card contact-card">

            <span className="eyebrow">
              CONTACT
            </span>

            <h2>Contact shop</h2>

            <p>
              Have a question about products
              or availability?
            </p>

            {shop.phone ? (

              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  window.location.href =
                    `tel:${shop.phone}`;
                }}
              >
                Call Shop
              </button>

            ) : (

              <button
                type="button"
                className="primary-button"
                disabled
              >
                Phone Unavailable
              </button>

            )}

            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/cart")}
            >
              View Cart
            </button>

          </div>


          <div className="details-card location-card">

            <span className="card-label">
              LOCATION
            </span>

            <div className="location-placeholder">
              <span>MAP</span>
            </div>

            <p>
              {shop.address ||
                shop.city ||
                "Location unavailable"}
            </p>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default ShopDetails;