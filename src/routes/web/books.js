const express = require('express')
const router = express.Router()
const uploadBook = require('../../middleware/upload-book')

const axios = require('axios')

const Book = require('../../models/Book')
//console.log(Book)
//GET
router.get('/', async (req, res) => {
  const books  =  await Book.find()
  //console.log(books)
  res.render("index", {
    title: "Список книг",
    books: books,
    page: 'books/books'
  })
})
router.get('/create', (req, res) => {
  res.render("index", {
    title: "Добавление книги",
    book: false,
    page: 'books/form'
  })
})
router.get('/update/:id', async (req, res) => {
  let book
  try {
    book = await Book.findById(req.params.id)
    if(book) res.render("index", {
      title: `Редактирование данных о книге ${book.title}`,
      book: book,
      page: 'books/form'
    })
    else res.status(404).render('index', {title: 'Ошибка 404 - запрашиваемый ресурс не найден', page: false})
  } catch(e) {
    console.error(e)
  }	
})
router.get('/:id', async (req, res) => {
  let book
  console.log('trying')
  try {
    
    book = await Book.findById(req.params.id).select('-__v')
    if(book) {
      let counter
      try {
        counter = await axios.post('http://counter/counter/' + req.params.id + '/incr')
        counter = counter.data.count
      } catch(e) {
        counter = '#'
      }
      res.render("index", {
        title: book.title,
        book: book,
        page: 'books/view',
        viewcount: counter
      })		
    } else res.status(404).render('index', {title: 'Ошибка 404 - запрашиваемый ресурс не найден', page: false})
  } catch(e) {
    console.log(e)
  }	
})
router.get('/:id/download', async (req, res) => {
  let book
  try {
    book = await Book.findById(req.params.id).select('fileBook')
    if(book) res.download(__dirname + '/../../public/books/' + book.fileBook)
    else res.status(404).render('index', {title: 'Ошибка 404 - запрашиваемый ресурс не найден', page: false})
  } catch(e) {
    console.log(e)
  }
  //
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
    res.status(500).json('Ошибка сервера')
  }
  
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