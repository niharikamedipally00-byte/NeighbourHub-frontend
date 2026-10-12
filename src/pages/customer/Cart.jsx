import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../../services/cartService";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    totalAmount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("neighbourhub_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const data = await getCart(token);
      setCart(data);
    } catch (err) {
      setError(err.message || "Unable to load your cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [navigate]);

  const changeQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;

    try {
      setUpdating(true);
      setError("");

      const token = localStorage.getItem("neighbourhub_token");

      const data = await updateCartItem(
        cartItemId,
        quantity,
        token
      );

      setCart(data);
    } catch (err) {
      setError(err.message || "Unable to update quantity.");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      setUpdating(true);
      setError("");

      const token = localStorage.getItem("neighbourhub_token");

      const data = await removeFromCart(cartItemId, token);

      setCart(data);
    } catch (err) {
      setError(err.message || "Unable to remove item.");
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (!confirmed) return;

    try {
      setUpdating(true);
      setError("");

      const token = localStorage.getItem("neighbourhub_token");

      await clearCart(token);

      setCart({
        items: [],
        totalItems: 0,
        totalAmount: 0,
      });
    } catch (err) {
      setError(err.message || "Unable to clear cart.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="page-state">
        <div className="page-state-content">
          <h2>Loading your cart</h2>
          <p>Please wait while we load your selected products.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">

      {/* HEADER */}
      <div className="cart-page-header">

        <div>
          <span className="eyebrow">
            SHOPPING CART
          </span>

          <h1>
            Your Cart
          </h1>

          <p>
            Review the products you've selected
            from local shops.
          </p>
        </div>

        {cart.items.length > 0 && (
          <button
            type="button"
            className="cart-clear-button"
            onClick={handleClearCart}
            disabled={updating}
          >
            Clear Cart
          </button>
        )}

      </div>

      {/* ERROR */}
      {error && (
        <div className="cart-error">
          {error}
        </div>
      )}

      {/* EMPTY CART */}
      {cart.items.length === 0 ? (

        <div className="cart-empty">

          <div className="cart-empty-icon">
            CART
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Explore local shops and add products
            to your cart.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/explore")}
          >
            Explore Local Shops
          </button>

        </div>

      ) : (

        <div className="cart-layout">

          {/* CART ITEMS */}
          <main className="cart-items-card">

            <div className="cart-card-header">

              <div>
                <span className="eyebrow">
                  SELECTED PRODUCTS
                </span>

                <h2>
                  Cart Items
                </h2>

                <p>
                  {cart.totalItems}{" "}
                  {cart.totalItems === 1
                    ? "item"
                    : "items"}{" "}
                  selected
                </p>
              </div>

            </div>

            <div className="cart-items">

              {cart.items.map((item) => (

                <article
                  className="cart-item"
                  key={item.id}
                >

                  {/* IMAGE */}
                  <div className="cart-item-image">

                    {item.productImageUrl ? (
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                      />
                    ) : (
                      <span>
                        {item.productName
                          ?.substring(0, 2)
                          .toUpperCase()}
                      </span>
                    )}

                  </div>

                  {/* DETAILS */}
                  <div className="cart-item-details">

                    <span className="cart-item-shop">
                      {item.shopName}
                    </span>

                    <h3>
                      {item.productName}
                    </h3>

                    <span className="cart-item-price">
                      ₹{Number(item.price || 0).toFixed(2)}
                    </span>

                    {!item.available && (
                      <span className="cart-item-unavailable">
                        Currently unavailable
                      </span>
                    )}

                  </div>

                  {/* CONTROLS */}
                  <div className="cart-item-controls">

                    <div className="quantity-control">

                      <button
                        type="button"
                        disabled={
                          updating ||
                          item.quantity <= 1
                        }
                        onClick={() =>
                          changeQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        disabled={
                          updating ||
                          !item.available
                        }
                        onClick={() =>
                          changeQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                    <strong className="cart-item-subtotal">
                      ₹{Number(item.subtotal || 0).toFixed(2)}
                    </strong>

                    <button
                      type="button"
                      className="cart-remove-button"
                      disabled={updating}
                      onClick={() =>
                        handleRemove(item.id)
                      }
                    >
                      Remove
                    </button>

                  </div>

                </article>

              ))}

            </div>

          </main>

          {/* SUMMARY */}
          <aside className="cart-summary-card">

            <div className="cart-summary-header">

              <span className="eyebrow">
                CHECKOUT
              </span>

              <h2>
                Order Summary
              </h2>

              <p>
                Review your total before continuing.
              </p>

            </div>

            <div className="cart-summary-row">
              <span>
                Items
              </span>

              <strong>
                {cart.totalItems}
              </strong>
            </div>

            <div className="cart-summary-row">
              <span>
                Subtotal
              </span>

              <strong>
                ₹{Number(cart.totalAmount || 0).toFixed(2)}
              </strong>
            </div>

            <div className="cart-summary-divider" />

            <div className="cart-summary-total">
              <span>
                Total
              </span>

              <strong>
                ₹{Number(cart.totalAmount || 0).toFixed(2)}
              </strong>
            </div>

            <button
              type="button"
              className="primary-button cart-checkout-button"
              onClick={() => navigate("/checkout")}
              disabled={updating}
            >
              Proceed to Checkout
            </button>

            <button
              type="button"
              className="secondary-button cart-continue-button"
              onClick={() => navigate("/explore")}
            >
              Continue Shopping
            </button>

          </aside>

        </div>

      )}

    </div>
  );
}

export default Cart;