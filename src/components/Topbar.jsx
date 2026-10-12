import { useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();

  let user = null;

  try {
    const storedUser = localStorage.getItem(
      "neighbourhub_user"
    );

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch {
    user = null;
  }

  return (
    <header className="topbar">

      <div className="topbar-brand">
        <span>
          NEIGHBOURHUB
        </span>

        <h1>
          NeighbourHub
        </h1>
      </div>


      <div className="topbar-actions">

        <button
          type="button"
          className="topbar-action-button"
          onClick={() =>
            alert("Wishlist will be connected later.")
          }
        >
          <span className="topbar-action-icon">
            ♡
          </span>

          <span>
            Wishlist
          </span>
        </button>


        <button
          type="button"
          className="topbar-action-button"
          onClick={() =>
            navigate("/cart")
          }
        >
          <span className="topbar-action-icon">
            🛒
          </span>

          <span>
            Cart
          </span>
        </button>


        <div className="topbar-user-name">
          {user?.name || "Neighbour"}
        </div>

      </div>

    </header>
  );
}

export default Topbar;