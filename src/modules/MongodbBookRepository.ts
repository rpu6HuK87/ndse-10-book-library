
import { injectable } from 'inversify'
import { BookInterface } from '../interfaces/BookInterface'
import { BookCreateDto } from '../models/BookCreate.dto'
import { BookModel } from '../models/BookModel'
import { AbstractBookRepository } from './AbstractBookRepository'
import { Types } from 'mongoose'

@injectable()
export class MongodbBookRepository extends AbstractBookRepository {
	constructor() {
		super()
		console.log('Экземляр MongodbBookRepository')
	}

	async createBook(bookdata: BookCreateDto): Promise<BookInterface> {
		const newBook = new BookModel(bookdata)
		await newBook.save()

		return newBook
	}

	async getBook(id: Types.ObjectId): Promise<BookInterface> {
		return await BookModel.findById(id).select('-__v')
	}

 	async getBooks(): Promise<BookInterface[]> {
		return await BookModel.find().select('-__v')
	}

	async updateBook(id: Types.ObjectId, bookdata: BookCreateDto): Promise<BookInterface> {
		return await BookModel.findByIdAndUpdate(id, bookdata)
	}

	async deleteBook(id: Types.ObjectId) {
		return await BookModel.deleteOne({_id: id})
	} 
}