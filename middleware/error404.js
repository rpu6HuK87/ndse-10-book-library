module.exports = (req, res) => {
  res.status(404).send('Ошибка 404 - запрашиваемый ресурс не найден')
}