const express = require('express')
const router = express.Router()

const User = require('../../models/User')

//GET
router.get('/', async (req, res) => {
  res.redirect('/user/me')
})
router.get('/me', async (req, res) => {
  res.render("index", {
    title: "Профиль",
    page: 'user/me',
    user: req.user
  })
})

router.get('/login', async (req, res) => {
  const badmsg = req.session.messages?.length ? req.session.messages.pop() : ''
  const msg = req.session.msg ? req.session.msg : null
  req.session.msg = req.session.messages = null
  if(req.isAuthenticated && req.isAuthenticated())	{
    res.status(307).redirect('/books')
  } else {
    res.render("index", {
      title: "Вход",
      page: 'user/login',
      nomenu: true,
      badmsg: badmsg,
      msg: msg
    })
  }  
})
router.get('/register', async (req, res) => {
  const badmsg = req.session.messages?.length ? req.session.messages.pop() : ''
  req.session.msg = req.session.messages = null
  res.render("index", {
    title: "Регистрация нового пользователя",
    page: 'user/register',
    nomenu: true,
    badmsg: badmsg
  })
})
router.get('/forgetpwd', async (req, res) => {
  const badmsg = req.session.messages?.length ? req.session.messages.pop() : ''
  const msg = req.session.msg ? req.session.msg : null
  req.session.msg = req.session.messages = null
  res.render("index", {
    title: "Сброс пароля",
    page: 'user/forgetpwd',
    nomenu: true,
    badmsg: badmsg,
    msg: msg
  })  
})


module.exports = router