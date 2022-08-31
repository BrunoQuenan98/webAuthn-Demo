import React, { useState } from "react";
import { useEffect } from "react";

export const Home = () => {
  const [credentials, setCredentials] = useState(undefined);
  const [userCanAddCredentials, setUserCanAddCredentials] = useState(undefined);

  useEffect(() =>{
    canAddCredentials();
  },[])

  const canAddCredentials = () => {
    if (window.PublicKeyCredential) {
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(
        (uvpaa) => {
          uvpaa ? setUserCanAddCredentials(false) : setUserCanAddCredentials(true);
        }
      );
    } else {
      return setUserCanAddCredentials(true);
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <span>
        This device does not support User Verifying Platform Authenticator. You
        can't register a credential.
      </span>
      <h3>Your registered credentials:</h3>
      {credentials &&
        credentials.length &&
        credentials.map((cred) => {
          return <span>{JSON.stringify(cred, null, 2)}</span>;
        })}
      <button disabled={userCanAddCredentials}>Add a credential</button>
      <button>Try Reauth</button>
      <button>Sign Out</button>
    </div>
  );
};
