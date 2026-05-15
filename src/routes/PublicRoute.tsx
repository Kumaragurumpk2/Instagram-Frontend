import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store';

const PublicRoute: React.FC = () => {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  return isAuthenticated ? <Navigate to="/feed" replace /> : <Outlet />;
};

export default PublicRoute;
