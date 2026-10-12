// src/pages/owner/MyShop.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllShops,
  getShopById,
} from "../../services/shopService";

function MyShop() {
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadShop = async () => {
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
        const user = JSON.parse(storedUser);

        setLoading(true);
        setError("");

        const shops = await getAllShops(token);

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

        if (ownerShops.length > 0) {
          const shopId =
            ownerShops[0].id;

          try {
            const fullShop =
              await getShopById(
                shopId,
                token
              );

            setShop(fullShop);
          } catch {
            setShop(ownerShops[0]);
          }
        } else {
          setShop(null);
        }
      } catch (err) {
        console.error(
          "My shop loading error:",
          err
        );

        setError(
          err.message ||
            "Unable to load your shop."
        );
      } finally {
        setLoading(false);
      }
    };

    loadShop();
  }, [navigate]);

  if (loading) {
    return (
      <div className="owner-page-state">
        <div className="owner-loading-mark">
          ...
        </div>
        <h2>Loading your shop...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="owner-page-state">
        <div className="owner-error-box">
          {error}
        </div>

        <button
          type="button"
          className="owner-primary-button"
          onClick={() =>
            window.location.reload()
          }
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="owner-my-shop-page">

        <div className="owner-page-header">
          <div>
            <p className="owner-eyebrow">
              MY BUSINESS
            </p>

            <h1>
              My Shop
            </h1>

            <p>
              Create your local shop profile
              and start adding products.
            </p>
          </div>
        </div>

        <section className="owner-no-shop-card">

          <div className="owner-no-shop-icon">
            +
          </div>

          <h2>
            You don't have a shop yet
          </h2>

          <p>
            Create your shop to start
            listing products and reaching
            customers in your neighbourhood.
          </p>

          <button
            type="button"
            className="owner-primary-button"
            onClick={() =>
              navigate(
                "/owner/shop/create"
              )
            }
          >
            Create My Shop
          </button>

        </section>

      </div>
    );
  }

  return (
    <div className="owner-my-shop-page">

      <div className="owner-page-header">

        <div>
          <p className="owner-eyebrow">
            MY BUSINESS
          </p>

          <h1>
            My Shop
          </h1>

          <p>
            Manage your local shop
            information and catalogue.
          </p>
        </div>

        <div className="owner-page-header-actions">

          <button
            type="button"
            className="owner-secondary-button"
            onClick={() =>
              navigate(
                "/owner/products"
              )
            }
          >
            View Products
          </button>

          <button
            type="button"
            className="owner-primary-button"
            onClick={() =>
              navigate(
                `/owner/shop/edit/${shop.id}`
              )
            }
          >
            Edit Shop
          </button>

        </div>

      </div>


      <section className="owner-shop-hero">

        <div className="owner-shop-logo">
          {shop.name
            ? shop.name
                .substring(0, 1)
                .toUpperCase()
            : "S"}
        </div>

        <div className="owner-shop-main">

          <div className="owner-shop-title-row">

            <div>
              <h2>
                {shop.name}
              </h2>

              <span className="owner-shop-category">
                {shop.category ||
                  "Local Shop"}
              </span>
            </div>

            <span className="owner-shop-status">
              ACTIVE
            </span>

          </div>

          <p className="owner-shop-description">
            {shop.description ||
              "Your local NeighbourHub shop."}
          </p>

        </div>

      </section>


      <div className="owner-shop-content-grid">

        <section className="owner-info-card">

          <div className="owner-card-header">

            <div>
              <p className="owner-card-eyebrow">
                SHOP INFORMATION
              </p>

              <h2>
                Business details
              </h2>
            </div>

          </div>


          <div className="owner-information-grid">

            <div className="owner-information-item">
              <span>
                Shop name
              </span>

              <strong>
                {shop.name || "—"}
              </strong>
            </div>


            <div className="owner-information-item">
              <span>
                Category
              </span>

              <strong>
                {shop.category || "—"}
              </strong>
            </div>


            <div className="owner-information-item">
              <span>
                Phone
              </span>

              <strong>
                {shop.phone ||
                  shop.contactNumber ||
                  "Not added"}
              </strong>
            </div>


            <div className="owner-information-item">
              <span>
                Email
              </span>

              <strong>
                {shop.email ||
                  "Not added"}
              </strong>
            </div>


            <div className="owner-information-item owner-information-wide">
              <span>
                Address
              </span>

              <strong>
                {shop.address ||
                  "Address not added"}
              </strong>
            </div>


            <div className="owner-information-item owner-information-wide">
              <span>
                Description
              </span>

              <strong>
                {shop.description ||
                  "No description added"}
              </strong>
            </div>

          </div>

        </section>


        <section className="owner-side-card">

          <div className="owner-side-card-icon">
            PRODUCTS
          </div>

          <h3>
            Manage your catalogue
          </h3>

          <p>
            Add products, update prices,
            manage stock and control
            availability.
          </p>

          <button
            type="button"
            className="owner-secondary-button owner-full-button"
            onClick={() =>
              navigate(
                "/owner/products"
              )
            }
          >
            Manage Products →
          </button>

        </section>

      </div>


      <section className="owner-location-card">

        <div>

          <p className="owner-card-eyebrow">
            SHOP LOCATION
          </p>

          <h2>
            {shop.address ||
              "Shop location"}
          </h2>

          <p>
            Customers can discover your
            business through NeighbourHub.
          </p>

        </div>

        <div className="owner-location-mark">
          MAP
        </div>

      </section>

    </div>
  );
}

export default MyShop;