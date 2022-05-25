import {Router} from 'express'
import { ioc } from '../container'
import { AbstractBookRepository } from '../modules/AbstractBookRepository'
import { Types } from 'mongoose'

export const booksRouter = Router()
import uploadBook from '../middleware/upload-book'

booksRouter.get('/', async (req, res) => {
	const repo = ioc.get(AbstractBookRepository)
  const books  =  await repo.getBooks()

  return res.json(books)
})

booksRouter.get('/:id', async (req, res) => {
  const repo = ioc.get(AbstractBookRepository)
	const book  =  await repo.getBook(new Types.ObjectId(req.params.id))

  return res.json(book)
})

booksRouter.post('/', uploadBook.single('book-file'), async (req, res) => {  
	const repo = ioc.get(AbstractBookRepository)
  req.body.fileBook = req.file ? req.file.filename : ''
  const newBook = await repo.createBook(req.body)

  return res.json(newBook)
})

booksRouter.delete('/:id', async (req, res) => {
	const repo = ioc.get(AbstractBookRepository)
	const state = await repo.deleteBook(new Types.ObjectId(req.params.id))

  return res.json(state)
})