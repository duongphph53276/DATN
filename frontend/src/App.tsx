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

function App() {
  const routes = useRoutes([
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
      ]
    },
    {
      path:"*", element:<NotFound/>
    }
  ])
  return routes;
}

export default App
