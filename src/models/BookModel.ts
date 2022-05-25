import { Schema, model, Document } from 'mongoose';
import { BookInterface } from '../interfaces/BookInterface';

const bookSchema = new Schema({
  title: {type: String, required: true},
  description: String,
  authors: [String],
  favorite: String,
  fileCover: String,
  fileName: String,
  fileBook: String
})

export const BookModel =  model<BookInterface>('BookModel', bookSchema)