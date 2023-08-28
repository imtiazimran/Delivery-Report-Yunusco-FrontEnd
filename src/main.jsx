import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './Components/Home.jsx';
import AddJobs from './Components/AddJobs.jsx';
import JobProvider from './Components/Context/JobProvider.jsx';
import PreviousDelivery from './Components/PreviousDelivery.jsx';
import TotalDelivery from './Components/TotalDelivery.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/addJobs",
        element: <AddJobs />
      },
      {
        path: "/previousDelivery",
        element: <PreviousDelivery/>
      },
      {
        path: "/totalDelivery",
        element: <TotalDelivery/>
      }
    ]
  },
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <JobProvider>
      <RouterProvider router={router} />
    </JobProvider>
  </React.StrictMode>,
)
