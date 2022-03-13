const express = require('express')
const router = express.Router()

const User = require('../../models/User')

//GET
router.get('/', async (req, res) => {
  //res.redirect('/user/me')
})

router.get('/login', async (req, res) => {
  res.render("index", {
		title: "Вход",
		page: 'user/login',
    nomenu: true
	})
})
router.get('/register', async (req, res) => {
  res.render("index", {
		title: "Регистрация нового пользователя",
		page: 'user/register',
    nomenu: true
	})
})


module.exports = router