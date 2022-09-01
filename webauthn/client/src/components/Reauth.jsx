import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const ReAuthentication = styled.div`
  display: ${(props) => (props.hidden === "hidden" ? "none" : "")};
`;
const Form = styled.form`
  display: ${(props) => (props.hidden === "hidden" ? "none" : "")};
`;

export const Reauth = () => {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const [displayReAuthenticate, setDisplayReAuthenticate] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);

  useEffect(() => {
    canAddCredentials();
  }, []);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // const res = await axios.post('/login', inputs);
    console.log('hola');
    navigate("/home");
  };

  const canAddCredentials = () => {
    if (window.PublicKeyCredential) {
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(
        (uvpaa) => {
          uvpaa && localStorage.getItem("credId")
            ? setDisplayReAuthenticate(true)
            : setDisplayForm(true);
        }
      );
    } else {
      return setDisplayForm(true);
    }
  };

  const handleClickPassword = () => {
    setDisplayForm(true);
    setDisplayReAuthenticate(false);
  };

  const handleAuthenticate = () => {
    // authenticate()
    //   .then((user) => {
    //     if (user) {
    //       navigate("/home");
    //     } else {
    //       throw "User not found.";
    //     }
    //   })
    //   .catch((e) => {
    //     console.error(e.message || e);
    //     alert("Authentication failed. Use password to sign-in.");
    //     setDisplayForm(true);
    //     setDisplayReAuthenticate(false);
    //   });
  };

  return (
    <div>
      <ReAuthentication hidden={displayReAuthenticate ? "" : "hidden"}>
        <button onClick={handleAuthenticate}>Authenticate</button>
        <button onClick={handleClickPassword}>Password</button>
      </ReAuthentication>
      <Form onSubmit={handleSubmit} hidden={displayForm ? "" : "hidden"}>
        <label>Usuario</label>
        <input type="text" name="username" onChange={handleInputChange} />
        <label>Password</label>
        <input
          type="password"
          name="password"
          onChange={handleInputChange}
        ></input>
        <input type="submit" value='ingresar'/>
      </Form>
    </div>
  );
};
