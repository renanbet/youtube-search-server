const User = require('./../models/user.js');
const Roles = require('./../enums/roles')
const DateService = require('./../lib/date')
const Auth = require('./../lib/auth')

const get = async (id) => {
  let user = await User.findOne(
    { _id: id },
    { _id: true, username: true, lastLogin: true })

  return {
    id: user._id,
    username: user.username,
    lastLogin: DateService.getDate(user.lastLogin)
  }
};

const insert = async (username, password) => {
  let user = await User.findOne({ username })

  if (user) {
    throw {
      error: "User already exists!"
    }
  }
  let userModel = new User()
  userModel.username = username
  userModel.password = Auth.createPasswordHash(password)
  userModel.role = Roles.user
  userModel.active = true

  await userModel.save()
  return true
};

const login = async (username, password) => {
  let user = await User.findOne({ username })
  if (!user || !Auth.passwordCompare(password, user.password)) {
    throw {
      error: "Invalid username or password!"
    }
  }
  if (!user.active) {
    throw {
      error: "Inactive user!"
    }
  }
  let dateNow = DateService.getToday()
  await User.findOneAndUpdate({ username }, { lastLogin: dateNow })

  const userToken = {
    id: user._id,
    role: user.role
  }
  let token = Auth.createToken(userToken)
  return {
    token,
    role: user.role
  }
};

module.exports = {
  get,
  insert,
  login
}
