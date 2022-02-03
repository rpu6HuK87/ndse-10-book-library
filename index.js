const express = require('express')
const formData = require('express-form-data');

const { Book } = require('./models/Book')

const store = {
  books: []
}
store.books.push(new Book('Супер книга', 'О том, о сем', 'Винтик и Шпунтик', '', '', 'superbook'))
const app = express()

//mw
app.use(express.json())
app.use(formData.parse())
app.use(express.urlencoded({ extended: true }))

//GET - get book(s)
app.get('/api/books', (req, res) => {
  return store.books.length ? res.json(store.books) : res.json('Библиотека пуста')
})
app.get('/api/books/:id', (req, res) => {
  const book = store.books.filter(book => book.id === req.params.id)
  return book.length
    ? res.json(book)
    : res.status(404).json('Книга не найдена')
})

//POST - add book
app.post('/api/books', (req, res) => {
  console.log(req.body)
  const { title, description, authors, favorite, fileCover, fileName } = req.body
  const newBook = new Book(title, description, authors, favorite, fileCover, fileName)
  store.books.push(newBook)
  res.status(201).json(newBook)
})

//PUT - edit book
app.put('/api/books/:id', (req, res) => {  
  const bookid = store.books.findIndex(book => book.id === req.params.id)

  if(bookid !== -1) {
    Object.entries(req.body).map(item => {      
      if(store.books[bookid].hasOwnProperty(item[0])) store.books[bookid][item[0]] = item[1]
    })
    res.json(store.books[bookid])
  } else return res.status(404).json('Книга не найдена')
})
//DELETE - remove book
app.delete('/api/books/:id', (req, res) => {
  const bookid = store.books.findIndex(book => book.id === req.params.id)
  if (bookid !== -1) {
    store.books.splice(bookid, 1);
    return res.json(true);
  } else return res.status(404).json('Книга не найдена')
})

//POST - auth
app.post('/api/user/login', (req, res) => {  
  res.status(201).json({ id: 1, mail: "rr.akhmetoff@gmail.com" })
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});