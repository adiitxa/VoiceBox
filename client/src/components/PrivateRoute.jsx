import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../atoms/authAtoms';

const PrivateRoute = ({ children }) => {
  const { token } = useRecoilValue(authState);
  return token ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;