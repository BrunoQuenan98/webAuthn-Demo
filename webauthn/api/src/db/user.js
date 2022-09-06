const { query } = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const model = mongoose.model;

const user = new Schema({
  username: String,
  password: String,
  currentChallenge: String,
});
const USER_MODEL = model("User", user);


/***********************************************************************************/

const getOneUserQuery = async (query) =>{
  const user = await USER_MODEL.findOne(query);
  return user;
}

const getUserFromDB = async (id) => {
  const user = await USER_MODEL.findById(id);
  return user;
};

const setUserCurrentChallenge = async (id, challenge) => {
  const userUpdated = await USER_MODEL.findByIdAndUpdate(
    id,
    { currentChallenge: challenge },
    { new: true }
  );
  return userUpdated;
};
module.exports = {
  getUserFromDB,
  setUserCurrentChallenge,
  getOneUserQuery,
  USER_MODEL,
};
