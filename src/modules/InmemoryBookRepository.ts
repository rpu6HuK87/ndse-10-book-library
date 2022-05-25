
import { injectable } from 'inversify'
import { BookInterface } from '../interfaces/BookInterface'
import { BookCreateDto } from '../models/BookCreate.dto'
import { AbstractBookRepository } from './AbstractBookRepository'

@injectable()
export class InmemoryBookRepository extends AbstractBookRepository {
	constructor() {
		super()
		console.log('Экземляр InmemoryBookRepository')
	}

	private books: BookInterface[]  = []

	async createBook(bookdata: BookCreateDto): Promise<BookInterface> {
		const newBook = {
			title: bookdata.title,
			description: '',
			authors: '',
			favorite: '',
			fileCover: '',
			fileName: '',
			fileBook: ''
		}
				
		this.books.push(newBook)

		return newBook
	}
	async getBook(id: any): Promise<BookInterface> {
		return this.books[id]
	} 
 	async getBooks(): Promise<BookInterface[]> {
		return this.books
	}
	async updateBook(id: any, bookdata: BookCreateDto): Promise<BookInterface> {
		const book = {
			title: bookdata.title,
			description: '',
			authors: '',
			favorite: '',
			fileCover: '',
			fileName: '',
			fileBook: ''
		}
		this.books[id] = book
		return book
	}
	async deleteBook(id: any) {
		this.books.splice(id, 1)
	} 
}