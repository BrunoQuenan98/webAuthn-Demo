const express = require("express");
const { Request, Response } = require("express");
const {
  getUserFromDB,
  setUserCurrentChallenge,
  USER_MODEL,
} = require("./src/db/user");
const {
  authenticators,
  getUserAuthenticators,
  getUserAuthenticator,
  saveNewUserAuthenticatorInDB,
  saveUpdatedAuthenticatorCounter,
  AUTHENTICATOR_MODEL,
} = require("./src/db/authenticator");
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require("@simplewebauthn/server");
const mongoose = require("mongoose");

const app = express();
const port = 8080;
console.error('ERROR ');
mongoose
  .connect(
    "mongodb+srv://BrunoQuenan98:RGpxB20Oghb8LDci@demowebauthn.xcl9h2p.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.error('ERROR 2');
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });

app.listen(8080, function () {
  console.log("Node server running on http://localhost:8080");
});
console.error('ERROR 2');

const rpName = "SimpleWebAuthn Example";

const rpID = "localhost";

const origin = `https://${rpID}`;

app.get("/credentials/:id", (req, res) =>{
  const { id } = req.params;
  const userAuthenticators = getUserAuthenticators(id);
  return res.json(userAuthenticators);
})


app.get("/options/:id", (req, res) => {
  const { id } = req.params;
  const user = getUserFromDB(id);

  const userAuthenticators = getUserAuthenticators(user.id);

  const options = generateRegistrationOptions({
    rpName,
    rpID,
    userID: user.id,
    userName: user.username,
    attestationType: "indirect",
    excludeCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      type: "public-key",
      transports: authenticator.transports,
    })),
  });

  setUserCurrentChallenge(user.id, options.challenge);

  return res.json(options);
});

app.post("/verify-registration-response/:id", async (req, res) => {
  const { body } = req;
  const { id } = req.params;

  const user = getUserFromDB(id);

  const expectedChallenge = user.currentChallenge;

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      credential: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error: error.message });
  }

  const { verified } = verification;

  if (verified) {
    const { registrationInfo } = verification;
    const { credentialPublicKey, credentialID, counter } = registrationInfo;
    const newAuthenticator = {
      _userId: id,
      credentialID,
      credentialPublicKey,
      counter,
    };

    saveNewUserAuthenticatorInDB(newAuthenticator);
  }
  return res.json(verified);
});

app.get("/authentication-options/:id", (req, res) => {
  const id = req.params;
  const user = getUserFromDB(id);

  const userAuthenticators = getUserAuthenticators(id);

  const options = generateAuthenticationOptions({
    allowCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      type: "public-key",

      transports: authenticator.transports,
    })),
    userVerification: "preferred",
  });

  setUserCurrentChallenge(user.id, options.challenge);

  return res.json(options);
});

app.post("/verify-authentication-response/:id", async (req, res) => {
  const { body } = req;

  const id = req.params;
  const user = getUserFromDB(id);

  const expectedChallenge = user.currentChallenge;

  const authenticator = getUserAuthenticator(id);

  if (!authenticator) {
    throw new Error(`Could not find authenticator`);
  }

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      credential: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error: error.message });
  }

  const { verified } = verification;
  if (verified) {
    const { authenticationInfo } = verification;
    const { newCounter } = authenticationInfo;
    saveUpdatedAuthenticatorCounter(authenticator, newCounter);
  }
  return res.json(verified);
});
