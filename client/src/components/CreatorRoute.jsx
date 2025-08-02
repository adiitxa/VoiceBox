import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../atoms/authAtoms';

const CreatorRoute = ({ children }) => {
  const { user, token } = useRecoilValue(authState);

  if (!token) {
    return <Navigate to="/auth" />;
  }

  if (user && user.role === 'Creator') {
    return children;
  }

  return <Navigate to="/" />; // Redirect non-creators to home
};

export default CreatorRoute;