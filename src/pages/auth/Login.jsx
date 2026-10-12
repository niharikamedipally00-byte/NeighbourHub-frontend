import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  loginUser,
  getCurrentUser,
} from "../../services/authService";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const successMessage = location.state?.message || "";

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const loginResponse = await loginUser(
        email.trim(),
        password
      );

      const token = loginResponse.token;

      localStorage.setItem(
        "neighbourhub_token",
        token
      );

      const user = await getCurrentUser(token);

      localStorage.setItem(
        "neighbourhub_user",
        JSON.stringify(user)
      );

      if (user.role === "CUSTOMER") {
        navigate("/customer/dashboard", {
          replace: true,
        });
      } else if (user.role === "SHOP_OWNER") {
        navigate("/owner/dashboard", {
          replace: true,
        });
      } else if (user.role === "SERVICE_PROVIDER") {
        navigate("/service-provider/dashboard", {
          replace: true,
        });
      } else if (user.role === "DELIVERY_PARTNER") {
        navigate("/delivery/dashboard", {
          replace: true,
        });
      } else {
        setError("Your account role is not supported.");
        localStorage.removeItem("neighbourhub_token");
        localStorage.removeItem("neighbourhub_user");
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-decoration auth-decoration-one" />
        <div className="auth-decoration auth-decoration-two" />
      </div>

      <div className="auth-container">

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

        <div className="auth-card">

          <div className="auth-card-header">
            <span className="auth-eyebrow">
              WELCOME BACK
            </span>

            <h1>
              Sign in to your account
            </h1>

            <p>
              Access local shops, services and
              everything around your neighbourhood.
            </p>
          </div>

          {successMessage && (
            <div className="auth-success">
              {successMessage}
            </div>
          )}

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
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">
                Password
              </label>

              <div className="auth-password-wrapper">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  placeholder="Enter your password"
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

          <div className="auth-divider">
            <span />
            <span>OR</span>
            <span />
          </div>

          <div className="auth-register">
            <span>
              New to NeighbourHub?
            </span>

            <Link to="/register">
              Create an Account
            </Link>
          </div>

        </div>

        <div className="auth-footer">
          NeighbourHub helps you discover and
          connect with your local community.
        </div>

      </div>
    </div>
  );
}

export default Login;