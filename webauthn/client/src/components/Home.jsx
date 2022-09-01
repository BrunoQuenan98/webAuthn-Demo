import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const [credentials, setCredentials] = useState(undefined);
  const [userCanAddCredentials, setUserCanAddCredentials] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    canAddCredentials();
  }, []);

  const canAddCredentials = () => {
    if (window.PublicKeyCredential) {
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(
        (uvpaa) => {
          uvpaa
            ? setUserCanAddCredentials(false)
            : setUserCanAddCredentials(true);
        }
      );
    } else {
      return setUserCanAddCredentials(true);
    }
  };

  const getCredentials = async () => {//TODO verificar ruta /auth/getKeys del backend
    const res = await axios.post("/auth/getKeys");
    setCredentials(res.credentials);
  };

  const removeCredential = async (e) => {
    try {
     // await unregisterCredential(e.target.id);
      getCredentials();
    } catch (e) {
      alert(e);
    }
  };

  const handleAddCredential = () =>{
    // registerCredential()
    //       .then((user) => {
    //         getCredentials();
    //       })
    //       .catch((e) => alert(e));
  }

  return (
    <div>
      <h1>Home</h1>
      {userCanAddCredentials && (
        <span>
          This device does not support User Verifying Platform Authenticator.
          You can't register a credential.
        </span>
      )}
      <h3>Your registered credentials:</h3>
      {credentials &&
        credentials.length &&
        credentials.map((cred) => {
          return <span>{JSON.stringify(cred, null, 2)}</span>;
        })}
      <button disabled={userCanAddCredentials} onClick={handleAddCredential}>Add a credential</button>
      <button onClick={() => navigate('/reauth')}>Try Reauth</button>
      <button>Sign Out</button>
    </div>
  );
};
