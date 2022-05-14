import { Schema, model, Document } from 'mongoose';

interface IBook extends Document {
	title: string
	description?: string
	authors?: string
	favorite?: string
	fileCover?: string
	fileName?: string
	fileBook?: string
}

const bookSchema = new Schema({
  title: {type: String, required: true},
  description: String,
  authors: String,
  favorite: String,
  fileCover: String,
  fileName: String,
  fileBook: String
})

const Book =  model<IBook>('Book', bookSchema)
export default Book