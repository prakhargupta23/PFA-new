/** @format */

import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import DocumentUpload from "../Pages/DocumentUpload";
import VoiceInput from "../components/voicecapturing";
import CapexUpload from "../Pages/CapexUpload";
import OweUpload from "../Pages/OweUpload";
import LoginPage from "../Pages/LoginPage";
import PrivateRoute from "./PrivateRoute";

export const routes = createBrowserRouter([

  {
    path: "/*",
    element: <LoginPage />,
  },
  {
    path: "/Dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/voice",
    element: (
      <PrivateRoute>
        <VoiceInput />
      </PrivateRoute>
    ),
  },

  {
    path: "/Upload",
    element: (
      <PrivateRoute>
        <DocumentUpload />
      </PrivateRoute>
    ),
  },
  {
    path: "/Capex",
    element: (
      <PrivateRoute>
        <CapexUpload />
      </PrivateRoute>
    ),
  },
  {
    path: "/OWE",
    element: (
      <PrivateRoute>
        <OweUpload />
      </PrivateRoute>
    ),
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
