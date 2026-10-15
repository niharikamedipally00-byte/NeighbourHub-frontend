import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllShops } from "../../services/shopService";
import { getAllProducts } from "../../services/productService";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem(
        "neighbourhub_token"
      );

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const [shopsData, productsData] =
          await Promise.all([
            getAllShops(token),
            getAllProducts(token),
          ]);

        setShops(
          Array.isArray(shopsData)
            ? shopsData
            : []
        );

        setProducts(
          Array.isArray(productsData)
            ? productsData
            : []
        );
      } catch (error) {
        console.error(
          "Customer dashboard loading error:",
          error
        );

        setShops([]);
        setProducts([]);
      } finally {
        setLoading(false);
        setLoadingProducts(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem(
        "neighbourhub_token"
      );

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "https://neighbourhub-backend-uns0.onrender.com/api/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.id,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to add product to cart"
        );
      }

      setCartMessage(
        `${product.name} added to your cart.`
      );

      setTimeout(() => {
        setCartMessage("");
      }, 2500);
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      setCartMessage(
        error.message ||
          "Unable to add product to cart."
      );

      setTimeout(() => {
        setCartMessage("");
      }, 2500);
    }
  };

  return (
    <div className="customer-dashboard">

      {/* HERO */}

      <section className="customer-hero">

        <div className="customer-hero-content">

          <p className="customer-eyebrow">
            WELCOME TO NEIGHBOURHUB
          </p>

          <h1>
            Find what you need,
            <br />
            right around you.
          </h1>

          <p>
            Discover local shops and services,
            compare options and support businesses
            in your neighbourhood.
          </p>

          <div className="customer-hero-actions">

            <button
              type="button"
              className="customer-primary-button"
              onClick={() =>
                navigate("/explore")
              }
            >
              Explore Local Shops
            </button>

            <button
              type="button"
              className="customer-secondary-button"
              onClick={() =>
                navigate("/orders")
              }
            >
              View Orders
            </button>

          </div>

        </div>

        <div className="customer-hero-card">

          <span>
            YOUR NEIGHBOURHOOD
          </span>

          <strong>
            Hyderabad
          </strong>

          <p>
            Discover products, shops and
            services available near you.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/explore")
            }
          >
            Start Exploring →
          </button>

        </div>

      </section>


      {/* STATS */}

      <section className="customer-stats-grid">

        <div className="customer-stat-card">
          <span>Local Shops</span>

          <strong>
            {shops.length}
          </strong>

          <small>
            Available nearby
          </small>
        </div>

        <div className="customer-stat-card">
          <span>Products</span>

          <strong>
            {products.length}
          </strong>

          <small>
            Available products
          </small>
        </div>

        <div className="customer-stat-card">
          <span>Orders</span>

          <strong>
            0
          </strong>

          <small>
            Your orders
          </small>
        </div>

        <div className="customer-stat-card">
          <span>Services</span>

          <strong>
            0
          </strong>

          <small>
            Available locally
          </small>
        </div>

      </section>


      {/* QUICK ACCESS */}

      <section className="customer-section">

        <div className="customer-section-header">

          <div>

            <p className="customer-section-eyebrow">
              QUICK ACCESS
            </p>

            <h2>
              What do you need today?
            </h2>

            <p>
              Quickly find the right local option.
            </p>

          </div>

        </div>

        <div className="customer-quick-grid">

          <button
            type="button"
            className="customer-quick-card"
            onClick={() =>
              navigate("/explore")
            }
          >
            <strong>
              Find a Shop
            </strong>

            <span>
              Browse nearby local businesses.
            </span>
          </button>


          <button
            type="button"
            className="customer-quick-card"
            onClick={() =>
              navigate("/explore")
            }
          >
            <strong>
              Find a Service
            </strong>

            <span>
              Discover trusted local service
              providers.
            </span>
          </button>


          <button
            type="button"
            className="customer-quick-card"
            onClick={() =>
              navigate("/orders")
            }
          >
            <strong>
              My Orders
            </strong>

            <span>
              Track your recent orders.
            </span>
          </button>


          <button
            type="button"
            className="customer-quick-card"
            onClick={() =>
              navigate("/wishlist")
            }
          >
            <strong>
              Wishlist
            </strong>

            <span>
              View products you have saved.
            </span>
          </button>

        </div>

      </section>


      {/* PRODUCTS */}

      <section className="customer-section">

        <div className="customer-section-header customer-business-header">

          <div>

            <p className="customer-section-eyebrow">
              SHOP LOCAL
            </p>

            <h2>
              Popular Products
            </h2>

            <p>
              Products available from local shops.
            </p>

          </div>

          <button
            type="button"
            className="customer-view-all-button"
            onClick={() =>
              navigate("/explore")
            }
          >
            View Shops
          </button>

        </div>


        {loadingProducts ? (

          <div className="customer-empty-card">

            <h3>
              Loading products...
            </h3>

            <p>
              Finding products from local shops.
            </p>

          </div>

        ) : products.length === 0 ? (

          <div className="customer-empty-card">

            <h3>
              No products available yet
            </h3>

            <p>
              Products from local shops will
              appear here.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/explore")
              }
            >
              Explore Shops
            </button>

          </div>

        ) : (

          <div className="customer-product-grid">

            {products
              .filter(
                (product) =>
                  product.available !== false
              )
              .slice(0, 8)
              .map((product) => (

                <div
                  className="customer-product-card"
                  key={product.id}
                >

                  <div className="customer-product-image">

                    {product.imageUrl ? (

                      <img
                        src={product.imageUrl}
                        alt={product.name}
                      />

                    ) : (

                      product.name
                        ?.charAt(0)
                        .toUpperCase() || "P"

                    )}

                  </div>


                  <div className="customer-product-content">

                    <span className="customer-product-category">
                      {product.category ||
                        "Product"}
                    </span>

                    <h3>
                      {product.name}
                    </h3>

                    <p>
                      {product.shopName ||
                        "Local Shop"}
                    </p>


                    <div className="customer-product-bottom">

                      <div>

                        <strong>
                          ₹{product.price}
                        </strong>

                        <small>
                          / unit
                        </small>

                      </div>

                      <button
                        type="button"
                        className="customer-add-cart-button"
                        onClick={() =>
                          handleAddToCart(product)
                        }
                      >
                        Add to Cart
                      </button>

                    </div>

                  </div>

                </div>

              ))}

          </div>

        )}

      </section>


      {/* LOCAL SHOPS */}

      <section className="customer-section">

        <div className="customer-section-header customer-business-header">

          <div>

            <p className="customer-section-eyebrow">
              NEARBY
            </p>

            <h2>
              Local Businesses
            </h2>

            <p>
              Explore shops available in your area.
            </p>

          </div>

          <button
            type="button"
            className="customer-view-all-button"
            onClick={() =>
              navigate("/explore")
            }
          >
            View All
          </button>

        </div>


        {loading ? (

          <div className="customer-empty-card">

            <h3>
              Finding local businesses...
            </h3>

            <p>
              Please wait while we load nearby shops.
            </p>

          </div>

        ) : shops.length === 0 ? (

          <div className="customer-empty-card">

            <h3>
              No shops available yet
            </h3>

            <p>
              Local businesses will appear here
              when they join NeighbourHub.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/explore")
              }
            >
              Explore Shops
            </button>

          </div>

        ) : (

          <div className="customer-business-grid">

            {shops
              .slice(0, 6)
              .map((shop) => (

                <button
                  type="button"
                  key={shop.id}
                  className="customer-business-card"
                  onClick={() =>
                    navigate(
                      `/shops/${shop.id}`
                    )
                  }
                >

                  <div className="customer-business-image">

                    {shop.name
                      ?.charAt(0)
                      .toUpperCase() || "N"}

                  </div>


                  <div className="customer-business-content">

                    <div className="customer-business-title">

                      <h3>
                        {shop.name}
                      </h3>

                      <span>
                        Open
                      </span>

                    </div>

                    <p>
                      {shop.category ||
                        "Local Business"}
                    </p>

                    <small>
                      {shop.city ||
                        "Hyderabad"}
                    </small>


                    <div className="customer-business-footer">

                      <span>
                        View Shop
                      </span>

                      <span>
                        →
                      </span>

                    </div>

                  </div>

                </button>

              ))}

          </div>

        )}

      </section>


      {/* COMMUNITY */}

      <section className="customer-community">

        <div>

          <p className="customer-section-eyebrow">
            SUPPORT LOCAL
          </p>

          <h2>
            Your everyday purchases
            can strengthen local businesses.
          </h2>

          <p>
            NeighbourHub connects customers
            with nearby shops and service
            providers, making local commerce
            easier for everyone.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/explore")
          }
        >
          Discover Local Businesses →
        </button>

      </section>


      {/* CART MESSAGE */}

      {cartMessage && (

        <div className="customer-cart-toast">

          <span>
            {cartMessage}
          </span>

          <button
            type="button"
            onClick={() =>
              navigate("/cart")
            }
          >
            View Cart
          </button>

        </div>

      )}

    </div>
  );
}

export default CustomerDashboard;