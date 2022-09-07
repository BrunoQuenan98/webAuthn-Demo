import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { webAuthn } from '../utils/webAuthn/WebAuthn';

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
    const res = await axios.get(`https://web-authn-demo-api.vercel.app/credentials/${JSON.parse(window.localStorage.getItem('id'))}`);
    setCredentials(res.data);
  };

  const removeCredential = async (e) => {
    try {
     // await unregisterCredential(e.target.id);
      getCredentials();
    } catch (e) {
      alert(e);
    }
  };

  const handleAddCredential = async () =>{
    webAuthn.registerCredential()
      .then(() =>{
         getCredentials();
      })
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
      <button onClick={handleAddCredential}>Add a credential</button>
      <button onClick={() => navigate('/reauth')}>Try Reauth</button>
      <button>Sign Out</button>
    </div>
  );
};
