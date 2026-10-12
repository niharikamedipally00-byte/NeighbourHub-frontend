import { useState } from "react";

function Profile() {
  const storedUser = localStorage.getItem("neighbourhub_user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const roleLabels = {
    CUSTOMER: "Customer",
    SHOP_OWNER: "Shop Owner",
    SERVICE_PROVIDER: "Service Provider",
    DELIVERY_PARTNER: "Delivery Partner",
  };

  const role =
    roleLabels[user?.role] || user?.role || "Member";

  const initials = name
    ? name
        .trim()
        .split(" ")
        .map((part) => part[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "N";

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: name.trim(),
      phone: phone.trim(),
    };

    localStorage.setItem(
      "neighbourhub_user",
      JSON.stringify(updatedUser)
    );

    setEditing(false);
  };

  return (
    <div className="profile-page">

      <section className="profile-page-header">

        <div>
          <span className="eyebrow">
            ACCOUNT
          </span>

          <h1>
            My Profile
          </h1>

          <p>
            Manage your NeighbourHub account information.
          </p>
        </div>

        <button
          type="button"
          className="profile-edit-button"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>

      </section>

      <section className="profile-identity-card">

        <div className="profile-avatar">
          {initials}
        </div>

        <div className="profile-identity-content">

          <h2>
            {name || "NeighbourHub User"}
          </h2>

          <span className="profile-role">
            {role}
          </span>

          <p>
            NeighbourHub member
          </p>

        </div>

      </section>

      <div className="profile-content-grid">

        <section className="profile-card">

          <div className="profile-card-heading">

            <span className="eyebrow">
              ACCOUNT DETAILS
            </span>

            <h2>
              Personal information
            </h2>

            <p>
              Your registered account details.
            </p>

          </div>

          {editing ? (

            <div className="profile-edit-form">

              <div className="profile-form-field">

                <label htmlFor="profile-name">
                  Full name
                </label>

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your full name"
                />

              </div>

              <div className="profile-form-field">

                <label htmlFor="profile-phone">
                  Phone number
                </label>

                <input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="Enter your phone number"
                />

              </div>

              <button
                type="button"
                className="profile-save-button"
                onClick={handleSave}
              >
                Save Changes
              </button>

            </div>

          ) : (

            <div className="profile-details-grid">

              <div className="profile-detail">

                <span>
                  FULL NAME
                </span>

                <strong>
                  {user?.name || "Not provided"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  EMAIL ADDRESS
                </span>

                <strong>
                  {user?.email || "Not provided"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  PHONE NUMBER
                </span>

                <strong>
                  {user?.phone || "Not provided"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  ACCOUNT TYPE
                </span>

                <strong>
                  {role}
                </strong>

              </div>

            </div>

          )}

        </section>

        <section className="profile-card">

          <div className="profile-card-heading">

            <span className="eyebrow">
              SECURITY
            </span>

            <h2>
              Account status
            </h2>

            <p>
              Current status of your NeighbourHub account.
            </p>

          </div>

          <div className="profile-status">

            <div className="profile-status-icon">
              ✓
            </div>

            <div>
              <h3>
                Account active
              </h3>

              <p>
                Your NeighbourHub account is active and
                ready to use.
              </p>
            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Profile;