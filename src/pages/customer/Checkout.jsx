import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCart, clearCart } from "../../services/cartService";
import { createOrder } from "../../services/orderService";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    deliveryAddress: "",
    phone: "",
  });

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const token = localStorage.getItem("neighbourhub_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const data = await getCart(token);
      setCart(data);
    } catch (err) {
      console.error("Checkout cart error:", err);
      setError(err.message || "Unable to load your cart.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  const totalItems = useMemo(() => {
    if (!cart?.items) return 0;

    return cart.items.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );
  }, [cart]);

  const totalAmount = useMemo(() => {
    if (!cart?.items) return 0;

    return cart.items.reduce(
      (total, item) =>
        total + Number(item.subtotal || item.price * item.quantity || 0),
      0
    );
  }, [cart]);

  async function handlePlaceOrder(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.deliveryAddress.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!cart?.items || cart.items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);

      const token = localStorage.getItem("neighbourhub_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const order = await createOrder(
        {
          deliveryAddress: form.deliveryAddress.trim(),
          phone: form.phone.trim(),
        },
        token
      );

      setSuccess("Order placed successfully.");

      try {
        await clearCart(token);
      } catch (clearError) {
        console.warn("Cart clear warning:", clearError);
      }

      setTimeout(() => {
        navigate(`/orders`);
      }, 700);

      console.log("Created Order:", order);
    } catch (err) {
      console.error("Place order error:", err);
      setError(err.message || "Unable to place your order.");
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <div className="page-state">
        <span className="eyebrow">CHECKOUT</span>
        <h2>Loading checkout...</h2>
        <p>We're preparing your order summary.</p>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="page-state page-state-error">
        <span className="eyebrow">CHECKOUT</span>
        <h2>Unable to load checkout</h2>
        <p>{error}</p>

        <button
          type="button"
          className="primary-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="page-state">
        <span className="eyebrow">CHECKOUT</span>
        <h2>Your cart is empty</h2>
        <p>Add products to your cart before proceeding to checkout.</p>

        <button
          type="button"
          className="primary-button"
          onClick={() => navigate("/explore")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <section className="page-header">
        <div>
          <span className="eyebrow">CHECKOUT</span>
          <h1>Complete your order</h1>
          <p>
            Confirm your delivery details and review your order before placing
            it.
          </p>
        </div>
      </section>

      {error && (
        <div className="checkout-alert checkout-alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="checkout-alert checkout-alert-success">
          {success}
        </div>
      )}

      <div className="checkout-layout">
        <main className="checkout-main">
          <form onSubmit={handlePlaceOrder}>
            <section className="checkout-card">
              <div className="checkout-card-header">
                <div>
                  <span className="eyebrow">DELIVERY</span>
                  <h2>Delivery information</h2>
                </div>
              </div>

              <div className="checkout-form-grid">
                <div className="checkout-field checkout-field-full">
                  <label htmlFor="deliveryAddress">
                    Delivery Address
                  </label>

                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={form.deliveryAddress}
                    onChange={handleChange}
                    placeholder="Enter your complete delivery address"
                    rows="5"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
            </section>

            <section className="checkout-card">
              <div className="checkout-card-header">
                <div>
                  <span className="eyebrow">ORDER</span>
                  <h2>Items in your order</h2>
                </div>

                <span className="checkout-item-count">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="checkout-items">
                {cart.items.map((item) => (
                  <div
                    className="checkout-item"
                    key={item.id || item.productId}
                  >
                    <div className="checkout-item-image">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                        />
                      ) : (
                        <span>
                          {item.productName?.charAt(0)?.toUpperCase() || "P"}
                        </span>
                      )}
                    </div>

                    <div className="checkout-item-info">
                      <strong>{item.productName}</strong>

                      {item.shopName && (
                        <span>{item.shopName}</span>
                      )}

                      <small>
                        ₹{Number(item.price || 0).toFixed(2)} ×{" "}
                        {item.quantity}
                      </small>
                    </div>

                    <strong className="checkout-item-total">
                      ₹
                      {Number(
                        item.subtotal ||
                          Number(item.price || 0) *
                            Number(item.quantity || 0)
                      ).toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>
            </section>

            <div className="checkout-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/cart")}
                disabled={placingOrder}
              >
                Back to Cart
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={placingOrder}
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </form>
        </main>

        <aside className="checkout-sidebar">
          <section className="checkout-summary-card">
            <span className="eyebrow">SUMMARY</span>

            <h2>Order Summary</h2>

            <div className="checkout-summary-row">
              <span>Items</span>
              <strong>{totalItems}</strong>
            </div>

            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <strong>₹{totalAmount.toFixed(2)}</strong>
            </div>

            <div className="checkout-summary-row">
              <span>Delivery</span>
              <strong>Free</strong>
            </div>

            <div className="checkout-summary-divider" />

            <div className="checkout-total-row">
              <span>Total</span>
              <strong>₹{totalAmount.toFixed(2)}</strong>
            </div>

            <p className="checkout-note">
              Your order will be placed with the selected local shops after
              you confirm your delivery details.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;