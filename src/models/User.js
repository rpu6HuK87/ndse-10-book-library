const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  email: {type: String, required: true},
  pwdhash: {type: String, required: true},
  name: String
})

module.exports = model('User', userSchema);