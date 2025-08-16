import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';

const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const [authState, setAuthState] = useState<null | boolean>(null); // null=loading, true=authed, false=not authed

  useEffect(() => {
    const getUser = async () => {
      const ret = await Preferences.get({ key: 'user' });
      if (ret.value) {
        setAuthState(true)
      }else{
        setAuthState(false);
      }
    }

    getUser();

  }, []);

  return (
    <Route
      {...rest}
      render={props =>
        authState === null
          ? <div>Loading...</div> // Or <IonLoading ... /> spinner
          : authState
            ? <Component {...props} />
            : (<Redirect to={{
              pathname: "/login",
              state: { from: props.location }
            }} />)
      }
    />
  );
};

export default ProtectedRoute;
