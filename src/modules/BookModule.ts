import Book from '../models/Book'

abstract class BookRepository {
	createBook(book: typeof Book): void {
		console.log('Метод создания книги не определен')
	}
	getBook(id: string): void {
		console.log('Метод получения книги по id не определен')
	} 
 	getBooks(): void {
		console.log('Метод получения всех книг не определен')
	}
	updateBook(id: string): void {
		console.log('Метод обновления книги не определен')
	}
	deleteBook(id: string): void {
		console.log('Метод удаления книги не определен')
	} 
}

const BookModule = {}

export default BookModule