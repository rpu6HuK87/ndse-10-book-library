const express = require('express')
const router = express.Router()
const uploadBook = require('../../middleware/upload-book')

const Book = require('../../models/Book')

//GET
router.get('/', async (req, res) => {
  const books  =  await Book.find().select('-__v')
  return books ? res.json(books) : res.json('Библиотека пуста')
})
router.get('/error', (req, res) => {
  throw new Error('Просто ошибка сервера')
})
router.get('/:id', async (req, res) => {
  let book
  try {
    book = await Book.findById(req.params.id).select('-__v')
    if(book) res.json(book)
    else res.status(404).json('Книга не найдена')
  } catch(e) {
    console.log(e)
  }
  
})
router.get('/:id/download', async (req, res) => {
  let book
  try {
    book = await Book.findById(req.params.id).select('fileBook')
    if(book) res.download(__dirname + '/../public/books/' + book.fileBook)
    else res.status(404).json('Книга не найдена')
  } catch(e) {
    console.log(e)
  }	
})

//POST
router.post('/', uploadBook.single('book-file'), async (req, res) => {
  const { title, description, authors, favorite, fileCover, fileName } = req.body
  const fileBook = req.file ? req.file.filename : ''
  const newBook = new Book({ title, description, authors, favorite, fileCover, fileName, fileBook })
  try {
    await newBook.save()
    res.status(201).json(newBook)
  } catch (e) {
    console.error(e)
    res.status(500).json('Ошибка сервера')
  }	
})

//PUT
router.put('/:id', uploadBook.single('book-file'), async (req, res) => {
  const { id } = req.params
  const { title, description, authors, favorite, fileCover, fileName } = req.body
  const fileBook = req.file ? req.file.filename : ''

  try {
    await Book.findByIdAndUpdate(id, { title, description, authors, favorite, fileCover, fileName, fileBook })
    res.redirect(`/api/books/${id}`)
  } catch (e) {
    console.error(e)
    res.status(404).json('Книга не найдена')
  }	
})

//DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    await Book.deleteOne({_id: id})
    res.json('ok')
  } catch (e) {
    console.error(e)
    res.status(404).json('Книга не найдена')
  }	
})

module.exports = router