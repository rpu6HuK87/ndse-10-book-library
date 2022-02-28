const express = require('express')
const mongoose = require('mongoose')
//require('dotenv').config()

const booksApi = require('./routes/api')
const booksWeb = require('./routes/web')

const error404 = require('./middleware/error404')
const error500 = require('./middleware/error500')

const app = express()

app.set('view engine', 'ejs')
app.set('views', './src/views');

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
const DBNAME = process.env.DB_NAME
const DBUSER = process.env.DB_USERNAME
const DBPASS = process.env.DB_PASSWORD

console.log(DBUSER)

;(async () => {
  try {
    await mongoose.connect('mongodb://db:27017/', {
      user: DBUSER,
      pass: DBPASS,
      dbName: DBNAME,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    app.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порту`))
  } catch(e) {
    console.log(e)
  }
})()