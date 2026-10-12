import { Routes, Route, Navigate } from "react-router-dom";

/* =========================
   AUTH
========================= */

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* =========================
   CUSTOMER
========================= */

import CustomerDashboard from "../pages/customer/CustomerDashboard";
import Explore from "../pages/customer/Explore";
import ShopDetails from "../pages/customer/ShopDetails";
import ServiceDetails from "../pages/customer/ServiceDetails";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import Orders from "../pages/customer/Orders";

/* =========================
   SHOP OWNER
========================= */

import OwnerDashboard from "../pages/owner/OwnerDashboard";
import MyShop from "../pages/owner/MyShop";
import CreateShop from "../pages/owner/CreateShop";
import Products from "../pages/owner/Products";
import CreateProduct from "../pages/owner/CreateProduct";
import EditProduct from "../pages/owner/EditProduct";
import OwnerOrders from "../pages/owner/OwnerOrders";

/* =========================
   SERVICE PROVIDER
========================= */

import ServiceProviderDashboard from "../pages/serviceProvider/ServiceProviderDashboard";
import MyServices from "../pages/serviceProvider/MyServices";
import AddService from "../pages/serviceProvider/AddService";
import ServiceRequests from "../pages/serviceProvider/ServiceRequests";

/* =========================
   DELIVERY PARTNER
========================= */

import DeliveryDashboard from "../pages/delivery/DeliveryDashboard";
import DeliveryHistory from "../pages/delivery/DeliveryHistory";
import AvailableDeliveries from "../pages/delivery/AvailableDeliveries";

/* =========================
   SHARED
========================= */

import Profile from "../pages/shared/Profile";
import Notifications from "../pages/shared/Notifications";
import Settings from "../pages/shared/Settings";

/* =========================
   LAYOUT / PROTECTION
========================= */

import DashboardLayout from "../layouts/DashboardLayout";
import RoleProtectedRoute from "./RoleProtectedRoute";
import EditService from "../pages/serviceProvider/EditService";


function AppRoutes() {
  return (
    <Routes>

      {/* ==================================================
          PUBLIC ROUTES
      ================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ==================================================
          COMMON AUTHENTICATED ROUTES
          CUSTOMER
          SHOP OWNER
          SERVICE PROVIDER
          DELIVERY PARTNER
      ================================================== */}

      <Route
        element={
          <RoleProtectedRoute
            allowedRoles={[
              "CUSTOMER",
              "SHOP_OWNER",
              "SERVICE_PROVIDER",
              "DELIVERY_PARTNER",
            ]}
          />
        }
      >
        <Route element={<DashboardLayout />}>

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>
      </Route>


      {/* ==================================================
          CUSTOMER ROUTES
      ================================================== */}

      <Route
        element={
          <RoleProtectedRoute
            allowedRoles={["CUSTOMER"]}
          />
        }
      >
        <Route element={<DashboardLayout />}>

          <Route
            path="/customer/dashboard"
            element={<CustomerDashboard />}
          />

          <Route
            path="/explore"
            element={<Explore />}
          />

          <Route
            path="/shops/:shopId"
            element={<ShopDetails />}
          />

          <Route
            path="/services/:serviceId"
            element={<ServiceDetails />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/orders"
            element={<Orders />}
          />

        </Route>
      </Route>


      {/* ==================================================
          SHOP OWNER ROUTES
      ================================================== */}

      <Route
        element={
          <RoleProtectedRoute
            allowedRoles={["SHOP_OWNER"]}
          />
        }
      >
        <Route element={<DashboardLayout />}>

          <Route
            path="/owner/dashboard"
            element={<OwnerDashboard />}
          />

          <Route
            path="/owner/shop"
            element={<MyShop />}
          />

          <Route
            path="/owner/shop/create"
            element={<CreateShop />}
          />

          <Route
            path="/owner/products"
            element={<Products />}
          />

          <Route
            path="/owner/products/create"
            element={<CreateProduct />}
          />

          <Route
            path="/owner/products/edit/:productId"
            element={<EditProduct />}
          />

          <Route
            path="/owner/orders"
            element={<OwnerOrders />}
          />

        </Route>
      </Route>


      {/* ==================================================
          SERVICE PROVIDER ROUTES
      ================================================== */}

      <Route
        element={
          <RoleProtectedRoute
            allowedRoles={["SERVICE_PROVIDER"]}
          />
        }
      >
        <Route element={<DashboardLayout />}>

          <Route
            path="/service-provider/dashboard"
            element={<ServiceProviderDashboard />}
          />

          <Route
            path="/service-provider/services"
            element={<MyServices />}
          />

          <Route
            path="/service-provider/services/create"
            element={<AddService />}
          />

          <Route
            path="/service-provider/requests"
            element={<ServiceRequests />}
          />

        </Route>
      </Route>


      {/* ==================================================
          DELIVERY PARTNER ROUTES
      ================================================== */}

      <Route
        element={
          <RoleProtectedRoute
            allowedRoles={["DELIVERY_PARTNER"]}
          />
        }
      >
        <Route element={<DashboardLayout />}>

          <Route
            path="/delivery/dashboard"
            element={<DeliveryDashboard />}
          />

          <Route
            path="/delivery/available"
            element={<AvailableDeliveries />}
          />

          <Route
            path="/delivery/history"
            element={<DeliveryHistory />}
          />

        </Route>
      </Route>


      {/* ==================================================
          DEFAULT
      ================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
  path="/service-provider/services/edit/:serviceId"
  element={<EditService />}
/>

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}

export default AppRoutes;