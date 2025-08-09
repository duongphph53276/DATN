import { useRoutes, Navigate } from 'react-router-dom';
import './App.css';
import NotFound from './components/404/NotFound';
import Home from './components/Client/HomePage/Home';
import ClientLayout from './layout/Client/Client.layout';
import Dashboard from './components/Admin/Dashboard';
import ListCategory from './components/Admin/category/ListCategory';
import AddCategory from './components/Admin/category/AddCategory';
import EditCategory from './components/Admin/category/EditCategory';
import AddProduct from './components/Admin/product/AddProduct';
import ProductList from './components/Admin/product/ListProduct';
import EditProduct from './components/Admin/product/EditProduct';
import AddAttribute from './components/Admin/attribute/AddAttribute';
import AttributeList from './components/Admin/attribute/ListAttribute';
import EditAttribute from './components/Admin/attribute/EditAttribute';
import ProductDetailAdmin from './components/Admin/product/ProductDetailAdmin';
import AdminLayout from './layout/Admin/Admin.layout';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ListUser from './components/Admin/user/ListUser';
import UserDetail from './components/Admin/user/UserDetail';
import EditUser from './components/Admin/user/EditUser';
import ListRole from './components/Admin/role/ListRole';
import AddRole from './components/Admin/role/AddRole';
import EditRole from './components/Admin/role/EditRole';
import ListVoucher from './components/Admin/voucher/ListVoucher';
import AddVoucher from './components/Admin/voucher/AddVoucher';
import EditVoucher from './components/Admin/voucher/EditVoucher';
import PermissionManagement from './components/Admin/permisson/Permission';
import ListOrderModule from './components/Admin/order/@ListOrderModule/ListOrderModule';
import OrderDetail from './components/Admin/order/@OrderDetail/OrderDetail';
import DetailsPage from './components/Client/HomePage/Detail';
import Cart from './components/Client/Account/Cart';
import Checkout from './components/Client/Account/Checkout';
import AllProducts from './components/Client/HomePage/AllProduct';
import ScrollToTop from './components/ScrollToTop';
import Profile from './components/Client/Account/Profile';
import UpdateProfile from './components/Client/Account/UpdateProfile';
import ChangePassword from './components/Client/Account/ChangePassword';
import AddressManagement from './components/Client/Account/AddressManagement';
import MyOrders from './components/Client/Account/MyOrders';
import NewsPage from './components/Client/HomePage/pages/NewPage';
import CategoryPage from './components/Client/HomePage/pages/CategoryPage';
import PaymentReturn from './components/Client/Payment/PaymentReturn';
import OrderDetailPage from './components/Client/Account/OrderDetailPage';
import ShipperLayout from './layout/Shipper/Shipper.layout';
import ProtectedShipperRoute from './components/Shipper/ProtectedShipperRoute';
import AllOrders from './components/Shipper/AllOrders';
import ShippingOrders from './components/Shipper/ShippingOrders';
import DeliveredOrders from './components/Shipper/DeliveredOrders';

const SimpleProtectedRoute = ({ children, requiresAdmin = false }: { children: JSX.Element; requiresAdmin?: boolean }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Cho phép cả admin và employee truy cập admin area
  if (requiresAdmin && role !== "admin" && role !== "employee") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : children;
};

function App() {
  const routes = useRoutes([
    {
      path: "/login",
      element: <AuthGuard><Login /></AuthGuard>,
    },
    {
      path: "/register",
      element: <AuthGuard><Register /></AuthGuard>,
    },
    {
      path: "/forgotpassword",
      element: <AuthGuard><ForgotPassword /></AuthGuard>,
    },
    {
      path: "/",
      element: <ClientLayout />,
      children: [
        { path: "", element: <Home /> },
        { path: "category/:slug", element: <CategoryPage /> },
        { path: "product/:id", element: <DetailsPage /> },
        { path: "cart", element: <SimpleProtectedRoute><Cart /></SimpleProtectedRoute> },
        { path: "checkout", element: <SimpleProtectedRoute><Checkout /></SimpleProtectedRoute> },
        { path: "all-products", element: <AllProducts /> },
        { path: "profile", element: <SimpleProtectedRoute><Profile /></SimpleProtectedRoute> },
        { path: "profile/edit", element: <SimpleProtectedRoute><UpdateProfile /></SimpleProtectedRoute> },
        { path: "profile/change-password", element: <SimpleProtectedRoute><ChangePassword /></SimpleProtectedRoute> },
        { path: "addresses", element: <SimpleProtectedRoute><AddressManagement /></SimpleProtectedRoute> },
        { path: "my-orders", element: <SimpleProtectedRoute><MyOrders /></SimpleProtectedRoute> },
        { path: "goc-cua-gau", element: <NewsPage /> },
        { path: "payment-return", element: <SimpleProtectedRoute><PaymentReturn /></SimpleProtectedRoute> },
        { path: "order-detail/:id", element: <OrderDetailPage /> },

      ],
    },
    {
      path: "/admin",
      element: <SimpleProtectedRoute requiresAdmin={true}><AdminLayout /></SimpleProtectedRoute>,
      children: [
        { path: "", element: <Dashboard /> },
        { path: "category", element: <ProtectedRoute requiredPermission="view_categories"><ListCategory /></ProtectedRoute> },
        { path: "category/add", element: <ProtectedRoute requiredPermission="create_category"><AddCategory /></ProtectedRoute> },
        { path: "category/edit/:id", element: <ProtectedRoute requiredPermission="edit_category"><EditCategory /></ProtectedRoute> },
        { path: "product", element: <ProtectedRoute requiredPermission="view_products"><ProductList /></ProtectedRoute> },
        { path: "product/add", element: <ProtectedRoute requiredPermission="create_product"><AddProduct /></ProtectedRoute> },
        { path: "product/edit/:id", element: <ProtectedRoute requiredPermission="edit_product"><EditProduct /></ProtectedRoute> },
        { path: "product/:id", element: <ProtectedRoute requiredPermission="view_products"><ProductDetailAdmin /></ProtectedRoute> },
        { path: "attribute", element: <ProtectedRoute requiredPermission="view_attributes"><AttributeList /></ProtectedRoute> },
        { path: "attribute/add", element: <ProtectedRoute requiredPermission="create_attribute"><AddAttribute /></ProtectedRoute> },
        { path: "attribute/edit/:id", element: <ProtectedRoute requiredPermission="edit_attribute"><EditAttribute /></ProtectedRoute> },
        { path: "voucher", element: <ProtectedRoute requiredPermission="view_vouchers"><ListVoucher /></ProtectedRoute> },
        { path: "voucher/add", element: <ProtectedRoute requiredPermission="create_voucher"><AddVoucher /></ProtectedRoute> },
        { path: "voucher/edit/:id", element: <ProtectedRoute requiredPermission="edit_voucher"><EditVoucher /></ProtectedRoute> },
        { path: "users", element: <ProtectedRoute requiredPermission="view_users"><ListUser /></ProtectedRoute> },
        { path: "users/:id", element: <ProtectedRoute requiredPermission="view_users"><UserDetail /></ProtectedRoute> },
        { path: "users/edit/:id", element: <ProtectedRoute requiredPermission="edit_user"><EditUser /></ProtectedRoute> },
        { path: "roles", element: <ProtectedRoute requiredPermission="view_roles"><ListRole /></ProtectedRoute> },
        { path: "roles/create", element: <ProtectedRoute requiredPermission="create_role"><AddRole /></ProtectedRoute> },
        { path: "roles/edit/:id", element: <ProtectedRoute requiredPermission="edit_role"><EditRole /></ProtectedRoute> },
        { path: "permissions", element: <ProtectedRoute requiredPermission="view_permissions"><PermissionManagement /></ProtectedRoute> },
        { path: "order-list", element: <ProtectedRoute requiredPermission="view_orders"><ListOrderModule /></ProtectedRoute> },
        { path: "order-detail/:id", element: <ProtectedRoute requiredPermission="view_orders"><OrderDetail /></ProtectedRoute> },
      ],
    },
    {
      path: "/shipper",
      element: <ProtectedShipperRoute><ShipperLayout /></ProtectedShipperRoute>,
      children: [
        { path: "", element: <AllOrders /> },
        { path: "shipping", element: <ShippingOrders /> },
        { path: "delivered", element: <DeliveredOrders /> },
      ],
    },
    { path: "*", element: <NotFound /> },
  ]);

  return (
    <>
      <ScrollToTop />
      {routes}
    </>
  );
}

export default App;