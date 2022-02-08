const express = require('express')
const router = express.Router()
const uploadBook = require('../middleware/upload-book')

const { Book } = require('../models/Book')
const store = {
  books: []
}
store.books.push(new Book('Супер книга', 'О том, о сем', 'Винтик и Шпунтик', '', '', 'superbook', 'super-book.jpg'))
console.log(store.books)

//GET
router.get('/', (req, res) => {
  return store.books.length ? res.json(store.books) : res.json('Библиотека пуста')
})
router.get('/error', (req, res) => {
  throw new Error('Просто ошибка сервера')
})
router.get('/:id', (req, res) => {
  const book = store.books.filter(book => book.id === req.params.id)
  return book.length
    ? res.json(book)
    : res.status(404).json('Книга не найдена')
})
router.get('/:id/download', (req, res) => {
  const bookid = store.books.findIndex(book => book.id === req.params.id)
  return (bookid !== -1)
    ? res.download(__dirname + '/../public/books/' + store.books[bookid].fileBook)
    : res.status(404).json('Книга не найдена')
})

//POST
router.post('/', uploadBook.single('book-file'), (req, res) => {
    //console.log(req.body)
    const { title, description, authors, favorite, fileCover, fileName } = req.body
    const fileBook = req.file ? req.file.filename : ''
    const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)
    store.books.push(newBook)
    res.status(201).json(newBook)
  }
)

//PUT
router.put('/:id', (req, res) => {  
  const bookid = store.books.findIndex(book => book.id === req.params.id)

  if(bookid !== -1) {
    Object.entries(req.body).map(item => {      
      if(store.books[bookid].hasOwnProperty(item[0])) store.books[bookid][item[0]] = item[1]
    })
    res.json(store.books[bookid])
  } else return res.status(404).json('Книга не найдена')
})

//DELETE
router.delete('/:id', (req, res) => {
  const bookid = store.books.findIndex(book => book.id === req.params.id)
  if (bookid !== -1) {
    store.books.splice(bookid, 1);
    return res.json(true);
  } else return res.status(404).json('Книга не найдена')
})

module.exports = router