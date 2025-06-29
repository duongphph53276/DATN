import { useRoutes } from 'react-router-dom';
import './App.css';
import NotFound from './components/404/NotFound';
import Home from './components/Client/HomePage/Home';
import ClientLayout from './layout/Client/Client.layout';
import Dashboard from './components/Admin/Dashboard';
import ListCategory from './components/Admin/category/ListCategory';
import AddCategory from './components/Admin/category/AddCategory';
import EditCategory from './components/Admin/category/EditCategory';
import AdminLayout from './layout/Admin/Admin.layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ListUser from './components/Admin/user/ListUser';
import EditUser from './components/Admin/user/EditUser';
import ListRole from './components/Admin/role/ListRole';
import AddRole from './components/Admin/role/AddRole';
import EditRole from './components/Admin/role/EditRole';

function App() {
  const routes = useRoutes([
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/forgotpassword", element: <ForgotPassword /> },
    {
      path: "/",
      element: <ClientLayout />,
      children: [{ path: "", element: <Home /> }]
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { path: "", element: <Dashboard /> },
        { path: "category", element: <ListCategory /> },
        { path: "category/add", element: <AddCategory /> },
        { path: "category/edit/:id", element: <EditCategory /> },
        { path: "users", element: <ListUser /> },
        { path: "users/edit/:id", element: <EditUser /> },
        { path: "roles", element:<ListRole/>},
        { path: "roles/create", element:<AddRole/>},
        { path: "roles/edit/:id", element:<EditRole/>}
      ]
    },
    { path: "*", element: <NotFound /> }
  ]);
  return routes;
}

export default App;