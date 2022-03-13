module.exports = (req, res) => {
  if(req.path.split('/')[1] === 'api')
    res.status(404).send('Ошибка 404 - запрашиваемый ресурс не найден')
  else
    res.status(404).render('index', {title: 'Ошибка 404 - запрашиваемый ресурс не найден', page: false})
}