import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'

export default (err: ErrorRequestHandler , req: Request, res: Response, next: NextFunction) => {
	res.status(500).json({msg: `Ошибка сервера - ${err.toString()}`})  
}