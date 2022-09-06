const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const model = mongoose.model;

const authenticator = new Schema({
  _userId: ObjectId,
  credentialID: Buffer,
  credentialPublicKey: Buffer,
  counter: Number,
  transports: Array,
});
const AUTHENTICATOR_MODEL = model("Authenticator", authenticator);


/***********************************************************************************/


const saveNewUserAuthenticatorInDB = async (authenticator) => {
  await AUTHENTICATOR_MODEL.create(authenticator);
};

const getUserAuthenticators = async (id) => {
  const authenticatorsUser = await AUTHENTICATOR_MODEL.find({ _userId: id });
  return authenticatorsUser;
};

const getUserAuthenticator = async (id) => {
  const authenticatorsUser = await AUTHENTICATOR_MODEL.findOne({ _userId: id });
  return authenticatorsUser;
};

const saveUpdatedAuthenticatorCounter = async (authenticator, counter) =>{
  const updatedAuthenticator = await AUTHENTICATOR_MODEL.findByIdAndUpdate(authenticator._id, { counter }, {new : true});
  return updatedAuthenticator;
}

module.exports = {
  saveNewUserAuthenticatorInDB,
  getUserAuthenticator,
  getUserAuthenticators,
  saveUpdatedAuthenticatorCounter,
  AUTHENTICATOR_MODEL,
};
