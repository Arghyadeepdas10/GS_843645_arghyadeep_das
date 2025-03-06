import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Header from './Layouts/Header'
import Stores from './components/Stores'
import SKU from './components/SKU'
import Planning from './components/Planning'
import Login from './Auth/Login'
import PrivateRouter from './Utils/PrivateRouter'

function App() {

  const router = createBrowserRouter([{
    path:"/",
    element:<Header/>,
    children:[
      {
        path:"/login",
        element:<Login/>
      },
      {
        element:<PrivateRouter/>,
        children:[
          {
            path:"/",
            element:<Stores/>
          },
          {
            path:"/sku",
            element:<SKU/>
          },
          {
            path:"/plannings",
            element:<Planning/>
          }
        ]
      }
     
    ]
  }])

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
