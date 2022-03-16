const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')

const User = require('../../models/User')

router.post('/login',
  passport.authenticate(
    'local',
    {
      failureRedirect: '/user/login',
      failureMessage: true,
      badRequestMessage: 'Неверные логин/пароль', //missing credentials
      //failureFlash: true
    },
  ),
  (req, res) => {
    res.redirect('/')
  }
)

router.post('/register',  (req, res) => {
  const { email, name, password } = req.body
  User.findOne({ email: email}, function (err, user) {
    if(user) {
      req.session.messages = ['Пользователь с таким e-mail уже есть в БД']
      res.redirect('/user/register')
    } else {
      bcrypt.hash(password, 10, async function(err, hash) {
        if(err) return false
        const pwdhash = hash
        console.log(pwdhash)
    
        const newUser = new User({ email, pwdhash, name })
        try {
          await newUser.save()
          req.session.msg = name + ', успешная регистрация! Теперь можно войти'
          res.redirect('/user/login')
        } catch (e) {
          console.error(e)
          res.status(500).json('Ошибка сервера. Все поля заполнили?')
        }
      }) 
    }
  })
   	
})

router.post('/forgetpwd',  (req, res) => {
  const { email } = req.body
  User.findOne({ email: email}, function (err, user) {
    if(user) req.session.msg = user.name + ', проверьте почту. Вам отправлена (на самом деле НЕТ) ссылка на восстановление пароля.'
    else req.session.messages = ['Пользователя с таким e-mail не найдено']
    res.redirect('/user/forgetpwd')    
  })
   	
})



module.exports = router