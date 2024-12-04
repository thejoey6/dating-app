import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import { useCookies } from 'react-cookie';

const RouterComponent = () => {
  const [cookies] = useCookies();
  const authToken = cookies.AuthToken;
  const userID = cookies.UserId

  const router = createBrowserRouter([
    {
      path: "/",
      element: (authToken && userID) ? <Navigate to='/dashboard' /> : <Home />,
    },
    {
      path: "/profile/:id",
      element: (authToken && userID) ? <Profile /> : <Navigate to='/' />, // Redirect to Home if no AuthToken and UserID
    },
    {
      path: "/dashboard",
      element: (authToken && userID) ? <Dashboard /> : <Navigate to='/' />, // Redirect to Home if no AuthToken and UserID
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterComponent />
  </React.StrictMode>
);
