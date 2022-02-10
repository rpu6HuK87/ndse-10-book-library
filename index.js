const express = require('express')
const booksApi = require('./routes/api')
const booksWeb = require('./routes/web')

const error404 = require('./middleware/error404')
const error500 = require('./middleware/error500')

const app = express()

app.set('view engine', 'ejs')

app.use('/api/books', booksApi)
app.use('/books', booksWeb)

//POST - auth
app.post('/api/user/login', (req, res) => {  
  res.status(201).json({ id: 1, mail: "rr.akhmetoff@gmail.com" })
})
app.get('/', (req, res) => {
  res.status(307).redirect('/books')
})

app.use(error404)
app.use(error500)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порту`))