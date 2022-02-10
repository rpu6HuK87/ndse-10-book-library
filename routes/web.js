const express = require('express')
const router = express.Router()
const uploadBook = require('../middleware/upload-book')

const { Book } = require('../models/Book')
const store = {
	books: []
}
store.books.push(new Book('Супер книга', 'О том, о сем', 'Винтик и Шпунтик', '', '', 'superbook', 'super-book.jpg'))
//console.log(store.books)

//GET
router.get('/', (req, res) => {
	const { books } = store
	res.render("books/index", {
		title: "Список книг",
		books: books,
		page: 'books'
	})
})
router.get('/create', (req, res) => {
	res.render("books/index", {
		title: "Добавление книги",
		book: false,
		page: 'form'
	})
})
router.get('/update/:id', (req, res) => {
	const bookid = store.books.findIndex(book => book.id === req.params.id)
	const book = store.books[bookid]
	if(book)
		res.render("books/index", {
			title: `Редактирование данных о книге ${book.title}`,
			book: book,
			page: 'form'
		})
})
router.get('/:id', (req, res) => {
	const bookid = store.books.findIndex(book => book.id === req.params.id)
	const book = store.books[bookid]
	res.render("books/index", {
		title: book.title,
		book: book,
		page: 'view'
	})	
})

router.get('/:id/download', (req, res) => {
	const bookid = store.books.findIndex(book => book.id === req.params.id)
	return (bookid !== -1)
		? res.download(__dirname + '/../public/books/' + store.books[bookid].fileBook)
		: res.status(404).json('Книга не найдена')
})
router.get('/error', (req, res) => {
	throw new Error('Просто ошибка сервера')
})

//POST
router.post('/create', uploadBook.single('book-file'), (req, res) => {
	//console.log(req.body)
	const { title, description, authors, favorite, fileCover, fileName } = req.body
	const fileBook = req.file ? req.file.filename : ''
	const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)
	store.books.push(newBook)
	res.redirect('/')
})
router.post('/update/:id', uploadBook.single('book-file'), (req, res) => {
	const bookid = store.books.findIndex(book => book.id === req.params.id)

	if(bookid !== -1) {
		if (req.file) req.body.fileBook = req.file.filename
		Object.entries(req.body).map(item => {
			if(store.books[bookid].hasOwnProperty(item[0])) store.books[bookid][item[0]] = item[1]
		})
		res.redirect('/books/' + req.params.id)
	}
})
router.post('/delete/:id', (req, res) => {
	const bookid = store.books.findIndex(book => book.id === req.params.id)
	if (bookid !== -1) {
		store.books.splice(bookid, 1);
	}
	res.redirect('/')
})

module.exports = router