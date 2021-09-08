import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const PrivateRoute = ({ children, ...restProps }) => {
  const { isAuthenticated, user } = useAuth0();

  const isUser = isAuthenticated && user;

  return (
    <Route
      {...restProps}
      render={() => {
        if (isUser) {
          return children;
        }

        if (!isUser) {
          return (
            <Redirect
              to={{
                pathname: "login",
              }}
            />
          );
        }

        return null;
      }}
    />
  );
};

export default PrivateRoute;
