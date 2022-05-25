
import { injectable } from 'inversify'
import { BookInterface } from '../interfaces/BookInterface'
import { BookCreateDto } from '../models/BookCreate.dto'
import { Types } from 'mongoose'

@injectable()
export abstract class AbstractBookRepository {	
	abstract createBook(bookdata: BookCreateDto): Promise<BookInterface>
	abstract getBook(id: Types.ObjectId): Promise<BookInterface> 
	abstract getBooks(): Promise<BookInterface[]>
	abstract updateBook(id: Types.ObjectId, bookdata: BookCreateDto): Promise<BookInterface>
	abstract deleteBook(id: Types.ObjectId): void
}