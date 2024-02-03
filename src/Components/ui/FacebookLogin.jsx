import React from 'react';
import { FacebookProvider, LoginButton } from 'react-facebook';

const FacebookLoginButton = () => {
  const handleSuccess = (response) => {
    console.log(response);
    // Handle login success, e.g., set user state
  };

  const handleError = (error) => {
    console.log(error);
    // Handle login error
  };

  return (
    <FacebookProvider appId="924767752698755">
      <LoginButton
        scope="email"
        onError={handleError}
        onSuccess={handleSuccess}
      >
        Login with Facebook
      </LoginButton>
    </FacebookProvider>
  );
};

export default FacebookLoginButton;
