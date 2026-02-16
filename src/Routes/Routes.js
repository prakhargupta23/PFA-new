/** @format */

import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import DocumentUpload from "../Pages/DocumentUpload";

export const routes = createBrowserRouter([
  // {
  //   path: "/Expenditure",
  //   element: (
  //     <PrivateRoute>
  //       <Expenditure />
  //     </PrivateRoute>
  //   ),
  // },
  {
    path: "/*",
    element: <Dashboard />,
  },
  {
    path: "/Upload",
    element: <DocumentUpload />,
  },
  // {
  //   path: "/pfa",
  //   element: (
  //     <PrivateRoute>
  //       <PFAPage />
  //     </PrivateRoute>
  //   ),
  // },
]);
