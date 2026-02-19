/** @format */

import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import DocumentUpload from "../Pages/DocumentUpload";
import VoiceInput from "../components/voicecapturing";

export const routes = createBrowserRouter([

  {
    path: "/*",
    element: <Dashboard />,
  },
  {
    path: "/voice",
    element: <VoiceInput />,
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
