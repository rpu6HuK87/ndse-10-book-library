const express = require('express')
const router = express.Router()
const uploadBook = require('../middleware/upload-book')

const axios = require('axios')

const Book = require('../models/Book')
//console.log(Book)
//GET
router.get('/', async (req, res) => {
	const books  =  await Book.find()
	//console.log(books)
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
router.get('/update/:id', async (req, res) => {
	let book
	try {
		book = await Book.findById(req.params.id)
		res.render("books/index", {
			title: `Редактирование данных о книге ${book.title}`,
			book: book,
			page: 'form'
		})
	} catch(e) {
		console.error(e)
	}
	res.status(404).render('books/index', {title: 'Ошибка 404 - запрашиваемый ресурс не найден', page: false})
})
router.get('/:id', async (req, res) => {
	let book
	try {
		book = await Book.findById(req.params.id).select('-__v')
		if(book) {
			let counter
			try {
				counter = await axios.post('http://counter/counter/' + book.id + '/incr')
				counter = counter.data.count
			} catch(e) {
				counter = '#'
			}
			res.render("books/index", {
				title: book.title,
				book: book,
				page: 'view',
				viewcount: counter
			})		
		}
	} catch(e) {
		console.log(e)
	}
	res.status(404).render('books/index', {title: 'Ошибка 404 - запрашиваемый ресурс не найден', page: false})	
})

router.get('/:id/download', async (req, res) => {
	let book
	try {
		book = await Book.findById(req.params.id).select('fileBook')
		res.download(__dirname + '/../public/books/' + book.fileBook)
	} catch(e) {
		console.log(e)
	}
	res.status(404).render('books/index', {title: 'Ошибка 404 - запрашиваемый ресурс не найден', page: false})
})

router.get('/error', (req, res) => {
	throw new Error('Просто ошибка сервера')
})

//POST
router.post('/create', uploadBook.single('book-file'), async (req, res) => {
	//console.log(req.body)
	const { title, description, authors, favorite, fileCover, fileName } = req.body
	const fileBook = req.file ? req.file.filename : ''
	const newBook = new Book({ title, description, authors, favorite, fileCover, fileName, fileBook })
	try {
		await newBook.save()
		res.redirect('/')
	} catch (e) {
		console.error(e)
	}
	res.status(500).json('Ошибка сервера')	
})
router.post('/update/:id', uploadBook.single('book-file'), async (req, res) => {
	const { id } = req.params
	const { title, description, authors, favorite, fileCover, fileName } = req.body
	const fileBook = req.file ? req.file.filename : ''

	try {
		await Book.findByIdAndUpdate(id, { title, description, authors, favorite, fileCover, fileName, fileBook })
	} catch (e) {
		console.error(e)
	}
	res.redirect('/books/' + id)	
})

router.post('/delete/:id', async (req, res) => {
	const { id } = req.params

	try {
		await Book.deleteOne({_id: id})
	} catch (e) {
		console.error(e)
	}
	res.redirect('/books')
})

module.exports = router