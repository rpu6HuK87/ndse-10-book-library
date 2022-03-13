module.exports = (req, res, next) => {

  const exceptions = ['/api/user/login', '/api/user/register', '/api/user/forgetpwd', '/user/login', '/user/register' ,'/user/forgetpwd']

  if((!req.isAuthenticated || !req.isAuthenticated()) && !exceptions.includes(req.path)) {
    if(req.path.split('/')[1] === 'api') {      
      res.status(401).json({status: 'Unauthorized'})
    } else {
      if (req.session) {
        req.session.returnTo = req.originalUrl || req.url
      }
      return res.redirect('/user/login')     
    }    
  }  
  next()
}