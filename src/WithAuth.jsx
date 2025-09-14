import React from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import { getAuthToken } from "./helpers/localstorage";

const ProtectedRoute = ({ children, isPublic = false }) => {
  const token = getAuthToken();
  if (!token && !isPublic) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (token && isPublic) {
    return <Navigate to="/dashboard" replace />;
  }

  return !isPublic ? (
    <div>
      <Navbar />
      <div>{children}</div>
    </div>
  ) : (
    children
  );
};

export default ProtectedRoute;
