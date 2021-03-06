const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  email: {type: String, unique : true, required : true, dropDups: true},
  pwdhash: {type: String, required: true},
  name: {type: String, required: true}
})

module.exports = model('User', userSchema);