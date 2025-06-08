import { useRoutes } from 'react-router-dom'
import './App.css'
import NotFound from './components/404/NotFound'
import Home from './components/Client/HomePage/Home';
import ClientLayout from './layout/Main/ClientLayout.main';
import Dashboard from './components/Admin/Dashboard';

function App() {
  const routes = useRoutes([
    {
      path:"/",
      element:<ClientLayout/>,
      children:[
        { path:"", element:<Home/>}
      ]
    },
    // Đây là route cho admin - middleware sẽ phân chia tiếp
    {
      path:"/admin",
      // element:<AdminLayout/>,
      // children:[
      //   {path:"", element:<Dashboard/>}
      // ]
      element:<Dashboard/>,
      children:[
        {path:"", element:<Dashboard/>} 
      ]
    },
    {
      path:"*", element:<NotFound/>
    }
  ])
  return routes;
}

export default App
