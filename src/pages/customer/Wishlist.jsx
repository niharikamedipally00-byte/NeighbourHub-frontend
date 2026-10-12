import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getWishlist,
  removeFromWishlist,
} from "../../services/wishlistService";

function Wishlist() {

  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCurrentUser = () => {

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

  const loadWishlist = async () => {

    try {

      setLoading(true);
      setError("");

      const user = getCurrentUser();

      if (!user?.id) {
        navigate("/login");
        return;
      }

      const data =
        await getWishlist(user.id);

      setItems(data || []);

    } catch (err) {

      setError(
        err.message ||
        "Unable to load wishlist"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeItem = async (productId) => {

    try {

      const user = getCurrentUser();

      if (!user?.id) {
        navigate("/login");
        return;
      }

      await removeFromWishlist(
        user.id,
        productId
      );

      setItems((current) =>
        current.filter(
          (item) =>
            item.productId !== productId
        )
      );

    } catch (err) {

      alert(
        err.message ||
        "Unable to remove product"
      );

    }
  };

  if (loading) {

    return (
      <div className="wishlist-page">
        <div className="wishlist-loading">
          Loading your wishlist...
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">

      <div className="wishlist-header">

        <div>
          <span className="wishlist-eyebrow">
            SAVED ITEMS
          </span>

          <h1>My Wishlist</h1>

          <p>
            Products you want to keep for later.
          </p>
        </div>

        <button
          className="wishlist-back-button"
          onClick={() => navigate("/explore")}
        >
          ← Continue Shopping
        </button>

      </div>

      {error && (
        <div className="wishlist-error">
          {error}
        </div>
      )}

      {items.length === 0 ? (

        <div className="wishlist-empty">

          <div className="wishlist-empty-icon">
            ♡
          </div>

          <h2>Your wishlist is empty</h2>

          <p>
            Save products you like and
            find them here later.
          </p>

          <button
            onClick={() => navigate("/explore")}
          >
            Explore Products
          </button>

        </div>

      ) : (

        <div className="wishlist-grid">

          {items.map((item) => (

            <div
              className="wishlist-card"
              key={item.id}
            >

              <div
                className="wishlist-image"
                onClick={() =>
                  navigate(
                    `/shops/${item.shopId}`
                  )
                }
              >

                {item.imageUrl ? (

                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                  />

                ) : (

                  <div className="wishlist-placeholder">
                    {item.productName?.charAt(0)}
                  </div>

                )}

                <button
                  className="wishlist-heart"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(item.productId);
                  }}
                >
                  ♥
                </button>

              </div>

              <div className="wishlist-content">

                <span className="wishlist-category">
                  {item.category || "Product"}
                </span>

                <h2>
                  {item.productName}
                </h2>

                <p className="wishlist-description">
                  {item.description ||
                    "Local product available on NeighbourHub."}
                </p>

                <div className="wishlist-shop">
                  🏪 {item.shopName || "Local Shop"}
                </div>

                <div className="wishlist-footer">

                  <strong>
                    ₹{item.price}
                  </strong>

                  <span
                    className={
                      item.available
                        ? "wishlist-available"
                        : "wishlist-unavailable"
                    }
                  >
                    {item.available
                      ? "Available"
                      : "Unavailable"}
                  </span>

                </div>

                <div className="wishlist-actions">

                  <button
                    className="wishlist-view-button"
                    onClick={() =>
                      navigate(
                        `/shops/${item.shopId}`
                      )
                    }
                  >
                    View Product
                  </button>

                  <button
                    className="wishlist-remove-button"
                    onClick={() =>
                      removeItem(item.productId)
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Wishlist;