module.exports = (req, res, next) => {
  if(!req.isAuthenticated || !req.isAuthenticated()) {
    if(req.path.split('/')[1] === 'api') {
      res.status(401).json({status: 'Unauthorized'})
    } else {
      if(req.path != '/user/login') {
        if (req.session) {
          req.session.returnTo = req.originalUrl || req.url
        }
        return res.redirect('/user/login')
      }      
    }    
  }
  next()
}