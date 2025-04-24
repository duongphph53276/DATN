import { useRoutes } from 'react-router-dom'
import './App.css'
import NotFound from './components/404/NotFound'
import Home from './components/Client/HomePage/Home';

function App() {
  const routes = useRoutes([
    {
      path:"/", element:<Home/>
    },
    {
      path:"*", element:<NotFound/>
    }
  ])
  return routes;
}

export default App
