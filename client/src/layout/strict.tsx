import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/login/login";
import React from "react";
import PrivateLayout from "./private-layout.layout";
import HomePage from "../pages/homepage/homepage";

export default function StrictRender() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path:"/homepage",
      element:<PrivateLayout/>,
      children:[{
        path:"",
        element:<HomePage/>
      }]
    }
  ]);
  return (
    <div>
      {import.meta.env.VITE_DEVELOPER_MODE === "develope" ? (
        <>
          <React.StrictMode>
            <RouterProvider router={router} />
          </React.StrictMode>
        </>
      ) : (
        <>
          <RouterProvider router={router} />
        </>
      )}
    </div>
  );
}
