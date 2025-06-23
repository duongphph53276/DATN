import { useRoutes } from 'react-router-dom'
import './App.css'
import NotFound from './components/404/NotFound'
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
import ListVoucher from './components/Admin/voucher/ListVoucher';

function App() {
  const routes = useRoutes([
    {path:"/login", element:<Login/>},
    {path:"/register", element:<Register/>},
    {path:"/forgotpassword", element:<ForgotPassword/>},
    {
      path:"/",
      element:<ClientLayout/>,
      children:[
        { path:"", element:<Home/>}
      ]
    },
    {
      path:"/admin",
      element:<AdminLayout/>,
      children:[
        {path:"", element:<Dashboard/>},
        {path:"category", element:<ListCategory/>},
        {path:"category/add", element:<AddCategory/>},
        {path:"category/edit/:id", element:<EditCategory/>},
        {path:"voucher", element:<ListVoucher/>},
        // {path:"voucher/add", element:<AddVoucher/>},
        // {path:"voucher/edit/:id", element:<EditVoucher/>},
        
      ]
    },
    {
      path:"*", element:<NotFound/>
    }
  ])
  return routes;
}

export default App
