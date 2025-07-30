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
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ListUser from './components/Admin/user/ListUser';
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
import NewsPage from './components/Client/HomePage/pages/NewPage';
import CategoryPage from './components/Client/HomePage/pages/CategoryPage';

const ProtectedRoute = ({ children, requiresAdmin = false }: { children: JSX.Element; requiresAdmin?: boolean }) => {
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
        { path: "cart", element: <ProtectedRoute><Cart /></ProtectedRoute> },
        { path: "checkout", element: <ProtectedRoute><Checkout /></ProtectedRoute> },
        { path: "all-products", element: <AllProducts /> },
        { path: "profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
        { path: "goc-cua-gau", element: <NewsPage /> },
        { path: "profile/edit", element: <ProtectedRoute><UpdateProfile /></ProtectedRoute> },
      ],
    },
    {
      path: "/admin",
      element: <ProtectedRoute requiresAdmin={true}><AdminLayout /></ProtectedRoute>,
      children: [
        { path: "", element: <Dashboard /> },
        { path: "category", element: <ListCategory /> },
        { path: "category/add", element: <AddCategory /> },
        { path: "category/edit/:id", element: <EditCategory /> },
        { path: "product", element: <ProductList /> },
        { path: "product/add", element: <AddProduct /> },
        { path: "product/edit/:id", element: <EditProduct /> },
        { path: "product/:id", element: <ProductDetailAdmin /> },
        { path: "attribute", element: <AttributeList /> },
        { path: "attribute/add", element: <AddAttribute /> },
        { path: "attribute/edit/:id", element: <EditAttribute /> },
        { path: "voucher", element: <ListVoucher /> },
        { path: "voucher/add", element: <AddVoucher /> },
        { path: "voucher/edit/:id", element: <EditVoucher /> },
        { path: "users", element: <ListUser /> },
        { path: "users/edit/:id", element: <EditUser /> },
        { path: "roles", element: <ListRole /> },
        { path: "roles/create", element: <AddRole /> },
        { path: "roles/edit/:id", element: <EditRole /> },
        { path: "permissions", element: <PermissionManagement /> },
        { path: "order-list", element: <ListOrderModule /> },
        { path: "order-detail/:id", element: <OrderDetail /> },
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