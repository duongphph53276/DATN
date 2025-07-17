import { useRoutes } from 'react-router-dom';
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
import AddVariant from './components/Admin/product/AddVariant';
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

function App() {
  const routes = useRoutes([
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/forgotpassword", element: <ForgotPassword /> },
    {
      path: "/",
      element: <ClientLayout />,
      children: [{ path: "", element: <Home /> },
        { path: "product/:id", element: <DetailsPage /> },
           {path : "/cart", element :<Cart/>},
           {path : "/checkout", element :<Checkout/>},
           {path :"/all-products", element : <AllProducts />},
           {path :"/profile", element : <Profile />},
           
         
      ]
      
    },
    
    {

      path: "/admin",
      element: <AdminLayout />,
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
        { path: "product/:id/add-variant", element: <AddVariant /> },
        { path: "voucher", element: <ListVoucher /> },
        { path: "voucher/add", element: <AddVoucher /> },
        { path: "voucher/edit/:id", element: <EditVoucher /> },
        { path: "users", element: <ListUser /> },
        { path: "users/edit/:id", element: <EditUser /> },
        { path: "roles", element: <ListRole /> },
        { path: "roles/create", element: <AddRole /> },
        { path: "roles/edit/:id", element: <EditRole /> },
        { path: "permissions", element: <PermissionManagement /> }, // Thêm route cho Permission
        { path: "order-list", element: <ListOrderModule /> }, 
        { path: "order-detail/:id", element: <OrderDetail /> }, 
      ]
    },
    { path: "*", element: <NotFound /> }
  ]);
   return (
    <>
      <ScrollToTop/>
      {routes}
    </>
  );
  return routes;
  
}


export default App;