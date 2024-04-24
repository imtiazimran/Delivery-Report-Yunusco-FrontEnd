import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './Components/Home.jsx';
import JobProvider from './Components/Context/JobProvider.jsx';
import PreviousDelivery from './Components/PreviousDelivery.jsx';
import TotalDelivery from './Components/TotalDelivery.jsx';
import PartialJobs from './Components/PartialJobs.jsx';
import Register from './Components/ui/Register.jsx';
import AuthProvider from './Components/Context/AuthProvider.jsx';
import Login from './Components/ui/Login.jsx';
import PrivetRoute from './Components/PriveteRoute.jsx';
import ManageUsers from './Components/ManageUsers.jsx';
import Sample from './Components/Sample/Sample.jsx';
import CalculatePalette from './Components/CalculatePallate/Calculation.jsx';
import { Provider } from 'react-redux';
import { store } from './Components/Redux/api/store.js';

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
        path: "/previousDelivery",
        element: <PreviousDelivery />
      },
      {
        path: "/totalDelivery",
        element: <PrivetRoute><TotalDelivery /></PrivetRoute>
      },
      {
        path: "/partialDelivery",
        element: <PartialJobs />
      },
      {
        path: "/registration",
        element: <Register />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/users",
        element: <ManageUsers />
      },
      {
        path: "/sample",
        element: <PrivetRoute><Sample /></PrivetRoute>
      },
      {
        path: '/calculatePallate',
        element: <CalculatePalette />
      }
    ]
  },
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <JobProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </JobProvider>
    </Provider>
  </React.StrictMode>,
)
