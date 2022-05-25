import { Request, Response } from 'express'

export default (req: Request, res: Response) => {
  res.status(404).json({msg: 'Ошибка 404 - запрашиваемый ресурс не найден'})
}