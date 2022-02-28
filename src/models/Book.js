const { Schema, model } = require('mongoose')

const bookSchema = new Schema({
  title: {type: String, required: true},
  description: String,
  authors: String,
  favorite: String,
  fileCover: String,
  fileName: String,
  fileBook: String
})

module.exports = model('Book', bookSchema);