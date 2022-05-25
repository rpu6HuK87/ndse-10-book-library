import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './src/public/books')
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

export default multer({ storage, fileFilter })