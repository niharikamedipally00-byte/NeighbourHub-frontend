import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getAllShops } from "../../services/shopService";
import ProductCard from "../../components/ProductCard";
import {
  addToWishlist,
  checkWishlist,
  removeFromWishlist,
} from "../../services/wishlistService";

const API_URL = "http://localhost:8080/api";

function Explore() {
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const [activeTab, setActiveTab] = useState("SHOPS");

  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem("neighbourhub_token");
  };

  const getUser = () => {
    const savedUser =
      localStorage.getItem("neighbourhub_user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  };

  /*
   * LOAD SHOPS
   */
  useEffect(() => {
    const loadShops = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          setError("Please sign in again.");
          setLoading(false);
          return;
        }

        const data = await getAllShops(token);

        setShops(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {
        setError(
          err.message ||
            "Unable to load shops."
        );
      } finally {
        setLoading(false);
      }
    };

    loadShops();
  }, []);

  /*
   * LOAD PRODUCTS
   */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);

        const response = await fetch(
          `${API_URL}/products`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load products"
          );
        }

        setProducts(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {
        console.error(
          "Product loading error:",
          err
        );

        setProducts([]);

      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  /*
   * SHOP CATEGORIES
   */
  const categories = useMemo(() => {
    const values = shops
      .map((shop) => shop.category)
      .filter(Boolean);

    return [
      "ALL",
      ...new Set(values),
    ];
  }, [shops]);

  /*
   * FILTER SHOPS
   */
  const filteredShops = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return shops.filter((shop) => {

      const matchesSearch =
        !query ||
        shop.name
          ?.toLowerCase()
          .includes(query) ||
        shop.category
          ?.toLowerCase()
          .includes(query) ||
        shop.city
          ?.toLowerCase()
          .includes(query) ||
        shop.address
          ?.toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "ALL" ||
        shop.category
          ?.toLowerCase() ===
          category.toLowerCase();

      const matchesStatus =
        status === "ALL" ||
        (
          status === "OPEN" &&
          shop.open === true
        ) ||
        (
          status === "CLOSED" &&
          shop.open !== true
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });

  }, [
    shops,
    search,
    category,
    status,
  ]);

  /*
   * FILTER PRODUCTS
   */
  const filteredProducts = useMemo(() => {

    const query =
      search.trim().toLowerCase();

    return products.filter(
      (product) => {

        if (!query) {
          return true;
        }

        return (
          product.name
            ?.toLowerCase()
            .includes(query) ||

          product.category
            ?.toLowerCase()
            .includes(query) ||

          product.description
            ?.toLowerCase()
            .includes(query) ||

          product.shopName
            ?.toLowerCase()
            .includes(query)
        );
      }
    );

  }, [products, search]);

  /*
   * NORMALIZE PRODUCT
   *
   * This makes the ProductCard work even
   * if your backend uses slightly different
   * property names.
   */
  const normalizedProducts =
    filteredProducts.map(
      (product) => ({
        ...product,

        id:
          product.id ??
          product.productId,

        name:
          product.name ??
          product.productName,

        imageUrl:
          product.imageUrl ??
          product.image,

        shopId:
          product.shopId ??
          product.shop?.id,

        shopName:
          product.shopName ??
          product.shop?.name,
      })
    );

  return (
    <div className="explore-page">

      {/* ==============================
          HEADER
      ============================== */}

      <section className="explore-header">

        <div>

          <span className="eyebrow">
            LOCAL DISCOVERY
          </span>

          <h1>
            Explore your neighbourhood
          </h1>

          <p>
            Find local shops, compare businesses
            and discover products available around you.
          </p>

        </div>

        <div className="explore-count">

          <strong>
            {activeTab === "SHOPS"
              ? filteredShops.length
              : normalizedProducts.length}
          </strong>

          <span>
            {activeTab === "SHOPS"
              ? filteredShops.length === 1
                ? "shop found"
                : "shops found"
              : normalizedProducts.length === 1
              ? "product found"
              : "products found"}
          </span>

        </div>

      </section>


      {/* ==============================
          TABS
      ============================== */}

      <section className="explore-tabs">

        <button
          className={
            activeTab === "SHOPS"
              ? "explore-tab active"
              : "explore-tab"
          }
          onClick={() =>
            setActiveTab("SHOPS")
          }
        >
          🏪 Shops
        </button>

        <button
          className={
            activeTab === "PRODUCTS"
              ? "explore-tab active"
              : "explore-tab"
          }
          onClick={() =>
            setActiveTab("PRODUCTS")
          }
        >
          🛍️ Products
        </button>

        <button
          className="explore-wishlist-tab"
          onClick={() =>
            navigate("/wishlist")
          }
        >
          ♥ Wishlist
        </button>

      </section>


      {/* ==============================
          TOOLBAR
      ============================== */}

      <section className="explore-toolbar">

        <div className="explore-search">

          <span>
            Search
          </span>

          <input
            type="text"
            placeholder={
              activeTab === "SHOPS"
                ? "Search shops, categories or locations..."
                : "Search products or categories..."
            }
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>


        {activeTab === "SHOPS" && (
          <>

            <div className="explore-filter">

              <label>
                Category
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
              >

                {categories.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item === "ALL"
                        ? "All Categories"
                        : item}
                    </option>
                  )
                )}

              </select>

            </div>


            <div className="explore-filter">

              <label>
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
              >

                <option value="ALL">
                  All Shops
                </option>

                <option value="OPEN">
                  Open Now
                </option>

                <option value="CLOSED">
                  Closed
                </option>

              </select>

            </div>

          </>
        )}

      </section>


      {/* ==============================
          ERROR
      ============================== */}

      {error && (
        <div className="explore-error">
          {error}
        </div>
      )}


      {/* ==============================
          SHOPS
      ============================== */}

      {activeTab === "SHOPS" && (

        loading ? (

          <div className="explore-state">

            <div className="explore-state-mark">
              NH
            </div>

            <h2>
              Finding local shops
            </h2>

            <p>
              Loading businesses from
              NeighbourHub...
            </p>

          </div>

        ) : filteredShops.length === 0 ? (

          <div className="explore-state">

            <div className="explore-state-mark">
              —
            </div>

            <h2>
              No shops found
            </h2>

            <p>
              Try changing your search
              or filters.
            </p>

            <button
              className="secondary-button"
              onClick={() => {
                setSearch("");
                setCategory("ALL");
                setStatus("ALL");
              }}
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <section className="explore-grid">

            {filteredShops.map(
              (shop) => (

                <Link
                  key={shop.id}
                  to={`/shops/${shop.id}`}
                  className="explore-shop-card"
                >

                  <div className="explore-shop-top">

                    <div className="explore-shop-avatar">

                      {shop.name
                        ?.substring(0, 2)
                        .toUpperCase()}

                    </div>

                    <span
                      className={
                        shop.open
                          ? "shop-status shop-status-open"
                          : "shop-status"
                      }
                    >
                      {shop.open
                        ? "Open"
                        : "Closed"}
                    </span>

                  </div>

                  <div className="explore-shop-content">

                    <span className="explore-shop-category">
                      {shop.category ||
                        "Local Business"}
                    </span>

                    <h2>
                      {shop.name}
                    </h2>

                    <p>
                      {shop.description ||
                        "A local business on NeighbourHub."}
                    </p>

                  </div>

                  <div className="explore-shop-location">

                    <span>
                      {shop.city ||
                        shop.address ||
                        "Local neighbourhood"}
                    </span>

                  </div>

                  <div className="explore-shop-footer">

                    <span>
                      View Shop
                    </span>

                    <strong>
                      →
                    </strong>

                  </div>

                </Link>

              )
            )}

          </section>

        )
      )}


      {/* ==============================
          PRODUCTS
      ============================== */}

      {activeTab === "PRODUCTS" && (

        productsLoading ? (

          <div className="explore-state">

            <div className="explore-state-mark">
              NH
            </div>

            <h2>
              Finding products
            </h2>

            <p>
              Loading products from local shops...
            </p>

          </div>

        ) : normalizedProducts.length === 0 ? (

          <div className="explore-state">

            <div className="explore-state-mark">
              —
            </div>

            <h2>
              No products found
            </h2>

            <p>
              Try another search.
            </p>

            <button
              className="secondary-button"
              onClick={() =>
                setSearch("")
              }
            >
              Clear Search
            </button>

          </div>

        ) : (

          <section className="product-explore-grid">

            {normalizedProducts.map(
              (product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              )
            )}

          </section>

        )

      )}

    </div>
  );
}

export default Explore;