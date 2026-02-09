/** @format */

import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../Pages/LoginPage";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Pages/Dashboard";
import DocumentUpload from "../Pages/DocumentUpload";
import ExecutiveSummary from "../modules/ExecutiveSummary";

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
