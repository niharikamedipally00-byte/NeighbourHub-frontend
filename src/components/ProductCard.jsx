import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  addToWishlist,
  checkWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const getCurrentUser = () => {
    const savedUser = localStorage.getItem("neighbourhub_user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const checkProductWishlist = async () => {
      try {
        const user = getCurrentUser();

        if (!user?.id || !product?.id) {
          return;
        }

        const result = await checkWishlist(
          user.id,
          product.id
        );

        setWishlisted(Boolean(result));
      } catch {
        // Wishlist check should not break product display.
      }
    };

    checkProductWishlist();
  }, [product?.id]);

  const handleWishlist = async (event) => {
    event.stopPropagation();

    const user = getCurrentUser();

    if (!user?.id) {
      alert("Please login to use your wishlist.");
      navigate("/login");
      return;
    }

    if (!product?.id) {
      alert("Product information is missing.");
      return;
    }

    try {
      setWishlistLoading(true);

      if (wishlisted) {
        await removeFromWishlist(
          user.id,
          product.id
        );

        setWishlisted(false);
      } else {
        await addToWishlist(
          user.id,
          product.id
        );

        setWishlisted(true);
      }
    } catch (error) {
      alert(
        error.message ||
          "Unable to update wishlist."
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleViewProduct = () => {
    if (!product?.id) {
      return;
    }

    if (product.shopId) {
      navigate(`/shops/${product.shopId}`);
    } else {
      navigate("/explore");
    }
  };

  if (!product) {
    return null;
  }

  return (
    <div className="product-card">

      <div
        className="product-card-image"
        onClick={handleViewProduct}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
          />
        ) : (
          <div className="product-image-placeholder">
            {product.name?.charAt(0)?.toUpperCase() || "P"}
          </div>
        )}

        <button
          className={`product-wishlist-button ${
            wishlisted ? "active" : ""
          }`}
          onClick={handleWishlist}
          disabled={wishlistLoading}
          title={
            wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          {wishlistLoading
            ? "..."
            : wishlisted
            ? "♥"
            : "♡"}
        </button>
      </div>

      <div className="product-card-content">

        <span className="product-card-category">
          {product.category || "Product"}
        </span>

        <h3>{product.name}</h3>

        <p className="product-card-description">
          {product.description ||
            "Quality product from a local shop."}
        </p>

        {product.shopName && (
          <div className="product-card-shop">
            🏪 {product.shopName}
          </div>
        )}

        <div className="product-card-bottom">

          <strong>
            ₹{product.price}
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

        <button
          className="product-view-button"
          onClick={handleViewProduct}
        >
          View Product
        </button>

      </div>

    </div>
  );
}

export default ProductCard;