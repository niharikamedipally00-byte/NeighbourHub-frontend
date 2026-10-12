import { Navigate, Outlet } from "react-router-dom";

function RoleProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("neighbourhub_token");

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

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = String(user.role || "").toUpperCase();

  if (!allowedRoles.includes(role)) {
    if (role === "CUSTOMER") {
      return <Navigate to="/customer/dashboard" replace />;
    }

    if (role === "SHOP_OWNER") {
      return <Navigate to="/owner/dashboard" replace />;
    }

    if (role === "SERVICE_PROVIDER") {
      return (
        <Navigate
          to="/service-provider/dashboard"
          replace
        />
      );
    }

    if (role === "DELIVERY_PARTNER") {
      return (
        <Navigate
          to="/delivery/dashboard"
          replace
        />
      );
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default RoleProtectedRoute;