const express = require("express");
const cors = require('cors');
const {
  getUserFromDB,
  setUserCurrentChallenge,
  getOneUserQuery,
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
const connectionDb = async () =>{
  try{
  await mongoose.connect(
          "mongodb+srv://BrunoQuenan98:RGpxB20Oghb8LDci@demowebauthn.xcl9h2p.mongodb.net/?retryWrites=true&w=majority"
        )
        // await USER_MODEL.create({
        //   username: 'Bruno',
        //   password: 'Pass2020$'
        // })
       console.log('Base de Datos Conectada'); 
  }catch(err){
    console.error(`Error connecting to the database. n${err}`);
  }
}

connectionDb();

app.use(express.json());
app.use(cors());

app.listen(8080, function () {
  console.log("Node server running on http://localhost:8080");
});
console.error('ERROR 2');

const rpName = "SimpleWebAuthn Example";

const rpID = "web-authn-demo.vercel.app";

const origin = `https://${rpID}`;

/***************************************************************/
//*************LOGIN

app.post('/login', async (req,res) =>{
  const { username, password } = req.body;
  const user = await getOneUserQuery({username, password});
  return res.json(user);
})






/***************************************************************/
//*************WEBAUTHN

app.get("/credentials/:id", async (req, res) =>{
  const { id } = req.params;
  const userAuthenticators = await getUserAuthenticators(id);
  return res.json(userAuthenticators);
})


app.get("/options/:id", async (req, res) => {
  const { id } = req.params;
  const user = await getUserFromDB(id);

  const userAuthenticators = await getUserAuthenticators(user.id);

  const options = generateRegistrationOptions({
    rpName,
    rpID,
    userID: user._id,
    userName: user.username,
    attestationType: "indirect",
    excludeCredentials: userAuthenticators && userAuthenticators.length ? userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      type: "public-key",
      transports: authenticator.transports,
    })) : [],
  });
  console.log('options', options.challenge)
  await setUserCurrentChallenge(user._id, options.challenge);

  return res.json(options);
});

app.post("/verify-registration-response/:id", async (req, res) => {
  const { body } = req;
  const { id } = req.params;

  const user = await getUserFromDB(id);

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
    return res.status(400).send({ error: error.message , body });
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

    await saveNewUserAuthenticatorInDB(newAuthenticator);
  }
  return res.json(verified);
});

app.get("/authentication-options/:id", async (req, res) => {
  const { id } = req.params;
  const user = await getUserFromDB(id);

  const userAuthenticators = await getUserAuthenticators(id);

  const options = generateAuthenticationOptions({
    allowCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      type: "public-key",

      transports: authenticator.transports,
    })),
    userVerification: "preferred",
  });

  await setUserCurrentChallenge(user._id, options.challenge);

  return res.json(options);
});

app.post("/verify-authentication-response/:id", async (req, res) => {
  const { body } = req;

  const { id } = req.params;
  const user = await getUserFromDB(id);

  const expectedChallenge = user.currentChallenge;

  const authenticator = await getUserAuthenticator(id);

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
    await saveUpdatedAuthenticatorCounter(authenticator, newCounter);
  }
  return res.json(verified);
});
