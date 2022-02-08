const express = require('express')
const booksRouter = require('./routes/books')

const error404 = require('./middleware/error404')
const error500 = require('./middleware/error500')

const app = express()

app.use('/api/books', booksRouter)

//POST - auth
app.post('/api/user/login', (req, res) => {  
  res.status(201).json({ id: 1, mail: "rr.akhmetoff@gmail.com" })
})

app.use(error404)
app.use(error500)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порту`))