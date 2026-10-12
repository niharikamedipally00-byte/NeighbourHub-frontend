import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        role: form.role,
      });

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Registration successful. Please sign in to continue.",
        },
      });
    } catch (err) {
      setError(
        err.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page register-page">
      <div className="auth-background">
        <div className="auth-decoration auth-decoration-one" />
        <div className="auth-decoration auth-decoration-two" />
      </div>

      <div className="auth-container register-container">

        <div className="auth-brand">
          <div className="auth-brand-mark">
            N
          </div>

          <div>
            <span className="auth-brand-name">
              NeighbourHub
            </span>

            <span className="auth-brand-tagline">
              Local commerce, connected.
            </span>
          </div>
        </div>

        <div className="auth-card register-card">

          <div className="auth-card-header">
            <span className="auth-eyebrow">
              GET STARTED
            </span>

            <h1>
              Create your account
            </h1>

            <p>
              Join your local community and connect
              with shops and services around you.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="auth-field">
              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                placeholder="Enter your full name"
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                placeholder="you@example.com"
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="phone">
                Phone Number
                <span className="optional-label">
                  Optional
                </span>
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                placeholder="Enter your phone number"
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="role">
                Account Type
              </label>

              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="CUSTOMER">
                  Customer
                </option>

                <option value="SHOP_OWNER">
                  Shop Owner
                </option>

                <option value="SERVICE_PROVIDER">
                  Service Provider
                </option>

                <option value="DELIVERY_PARTNER">
                  Delivery Partner
                </option>
              </select>

              <span className="field-help">
                You can use NeighbourHub according to
                your selected role.
              </span>
            </div>

            <div className="register-password-grid">

              <div className="auth-field">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  placeholder="Minimum 6 characters"
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  placeholder="Re-enter password"
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>

            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          <div className="auth-divider">
            <span />
            <span>OR</span>
            <span />
          </div>

          <div className="auth-register">
            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign In
            </Link>
          </div>

        </div>

        <div className="auth-footer">
          By creating an account, you agree to use
          NeighbourHub responsibly within your community.
        </div>

      </div>
    </div>
  );
}

export default Register;