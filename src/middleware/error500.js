module.exports = (err, req, res, next) => {
  if(req.path.split('/')[1] === 'api')
    res.status(500).send(`Ошибка сервера - ${err.toString()}`)
  else
    res.status(500).render('books/index', {title: 'Ошибка 500', page: false, error: err.toString()})
}