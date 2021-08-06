import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';
import { useAuthentication } from './useAuthentication';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const { session } = useAuthentication();

  return <Route {...rest} render={(props) => (session ? <Component {...props} /> : <Redirect to="/login" />)} />;
};
