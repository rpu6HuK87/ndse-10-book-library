import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import 'reflect-metadata'

console.log(process.env)

import { booksRouter } from './routes/BooksRoutes'

import error404 from './middleware/error404'
import error500 from './middleware/error500'

require('./mongodb.connection')
require('./container')
require('./ioc.config')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/books', booksRouter)

app.use(error404)
app.use(error500)

app.listen(8080, () => console.log('Приложение работает!'))