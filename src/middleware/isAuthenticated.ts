import { NextFunction, Request, Response } from 'express'

export default (req: Request, res: Response, next: NextFunction) => {
	//req.isAuthenticated()
	if(true) next()
  else res.status(401).json({status: 'Unauthorized'})
}