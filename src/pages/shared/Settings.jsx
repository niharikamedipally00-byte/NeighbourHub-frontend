import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [serviceUpdates, setServiceUpdates] = useState(true);
  const [language, setLanguage] = useState("English");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleSignOut = () => {
    localStorage.removeItem("neighbourhub_token");
    localStorage.removeItem("neighbourhub_user");
    navigate("/login");
  };

  return (
    <div className="settings-page">

      {/* Header */}
      <div className="settings-header">
        <div>
          <p className="settings-eyebrow">ACCOUNT SETTINGS</p>

          <h1>Settings</h1>

          <p className="settings-subtitle">
            Manage your account preferences and notifications.
          </p>
        </div>

        <button
          className="settings-save-button"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>

      {saved && (
        <div className="settings-success">
          Your settings have been saved successfully.
        </div>
      )}

      <div className="settings-layout">

        {/* Account */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div>
              <h2>Account</h2>
              <p>Manage your personal account information.</p>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-content">
              <h3>Profile</h3>
              <p>
                Update your name, phone number and other profile details.
              </p>
            </div>

            <button
              className="settings-outline-button"
              onClick={() => navigate("/profile")}
            >
              View Profile
            </button>
          </div>

          <div className="settings-divider" />

          <div className="settings-row">
            <div className="settings-row-content">
              <h3>Change Password</h3>
              <p>
                Update your account password regularly for better security.
              </p>
            </div>

            <button className="settings-outline-button">
              Change Password
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div>
              <h2>Preferences</h2>
              <p>Customize how NeighbourHub communicates with you.</p>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-content">
              <h3>Notifications</h3>
              <p>
                Receive important updates and activity notifications.
              </p>
            </div>

            <label className="settings-switch">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />

              <span className="settings-slider"></span>
            </label>
          </div>

          <div className="settings-divider" />

          <div className="settings-row">
            <div className="settings-row-content">
              <h3>Order Updates</h3>
              <p>
                Get notified about order confirmation and delivery status.
              </p>
            </div>

            <label className="settings-switch">
              <input
                type="checkbox"
                checked={orderUpdates}
                onChange={(e) => setOrderUpdates(e.target.checked)}
              />

              <span className="settings-slider"></span>
            </label>
          </div>

          <div className="settings-divider" />

          <div className="settings-row">
            <div className="settings-row-content">
              <h3>Service Updates</h3>
              <p>
                Receive updates about requested local services.
              </p>
            </div>

            <label className="settings-switch">
              <input
                type="checkbox"
                checked={serviceUpdates}
                onChange={(e) => setServiceUpdates(e.target.checked)}
              />

              <span className="settings-slider"></span>
            </label>
          </div>

          <div className="settings-divider" />

          <div className="settings-row">
            <div className="settings-row-content">
              <h3>Language</h3>
              <p>
                Select the language used across NeighbourHub.
              </p>
            </div>

            <select
              className="settings-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Telugu</option>
              <option>Hindi</option>
            </select>
          </div>
        </section>

        {/* Privacy */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div>
              <h2>Privacy</h2>
              <p>Control how your account information is handled.</p>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-content">
              <h3>Account Visibility</h3>
              <p>
                Your profile information is only shown where required
                for NeighbourHub services.
              </p>
            </div>

            <span className="settings-status">
              Protected
            </span>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="settings-card settings-danger-card">
          <div className="settings-card-header">
            <div>
              <h2>Account Actions</h2>
              <p>Manage your current NeighbourHub session.</p>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-content">
              <h3>Sign Out</h3>
              <p>
                Sign out from this device and return to the login page.
              </p>
            </div>

            <button
              className="settings-danger-button"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Settings;