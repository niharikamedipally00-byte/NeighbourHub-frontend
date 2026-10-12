import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
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

  const role = user?.role || "CUSTOMER";

  const getInitials = () => {
    if (!user?.name) {
      return "N";
    }

    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem(
      "neighbourhub_token"
    );

    localStorage.removeItem(
      "neighbourhub_user"
    );

    navigate("/login");
  };

  const customerNavigation = [
    {
      label: "Dashboard",
      path: "/customer/dashboard",
    },
    {
      label: "Explore",
      path: "/explore",
    },
    {
      label: "Orders",
      path: "/orders",
    },
  ];

  const ownerNavigation = [
    {
      label: "Dashboard",
      path: "/owner/dashboard",
    },
    {
      label: "My Shop",
      path: "/owner/shop",
    },
    {
      label: "Products",
      path: "/owner/products",
    },
    {
      label: "Orders",
      path: "/owner/orders",
    },
  ];

  const serviceProviderNavigation = [
    {
      label: "Dashboard",
      path: "/service-provider/dashboard",
    },
    {
      label: "My Services",
      path: "/service-provider/services",
    },
    {
      label: "Requests",
      path: "/service-provider/requests",
    },
  ];

  const deliveryNavigation = [
    {
      label: "Dashboard",
      path: "/delivery/dashboard",
    },
    {
      label: "Available Deliveries",
      path: "/delivery/available",
    },
    {
      label: "Delivery History",
      path: "/delivery/history",
    },
  ];

  let navigation = [];

  if (role === "CUSTOMER") {
    navigation = customerNavigation;
  } else if (role === "SHOP_OWNER") {
    navigation = ownerNavigation;
  } else if (role === "SERVICE_PROVIDER") {
    navigation = serviceProviderNavigation;
  } else if (role === "DELIVERY_PARTNER") {
    navigation = deliveryNavigation;
  }

  const getRoleName = () => {
    if (role === "SHOP_OWNER") {
      return "Shop Owner";
    }

    if (role === "SERVICE_PROVIDER") {
      return "Service Provider";
    }

    if (role === "DELIVERY_PARTNER") {
      return "Delivery Partner";
    }

    return "Customer";
  };

  const getRoleLabel = () => {
    if (role === "SHOP_OWNER") {
      return "SHOP OWNER";
    }

    if (role === "SERVICE_PROVIDER") {
      return "SERVICE PROVIDER";
    }

    if (role === "DELIVERY_PARTNER") {
      return "DELIVERY PARTNER";
    }

    return "CUSTOMER";
  };

  return (
    <aside className="sidebar">

      <div className="sidebar-brand">

        <div className="sidebar-brand-mark">
          N
        </div>

        <div>
          <strong>
            NeighbourHub
          </strong>

          <span>
            Local commerce
          </span>
        </div>

      </div>


      <div className="sidebar-role">
        {getRoleLabel()}
      </div>


      <nav className="sidebar-navigation">

        {navigation.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            {item.label}
          </NavLink>

        ))}

      </nav>


      <div className="sidebar-bottom">

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          Notifications
        </NavLink>


        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          Profile
        </NavLink>


        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          Settings
        </NavLink>


        <div className="sidebar-user">

          <div className="sidebar-user-avatar">
            {getInitials()}
          </div>

          <div className="sidebar-user-info">

            <strong>
              {user?.name ||
                "NeighbourHub User"}
            </strong>

            <span>
              {getRoleName()}
            </span>

          </div>

        </div>


        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          Sign Out
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;