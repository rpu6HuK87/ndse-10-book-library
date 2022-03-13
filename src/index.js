const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
//const crypto = require('crypto')

const User = require('./models/User')
const salt = process.env.SALT || "solenayaSol'"
console.log(salt)

function verify (email, password, done) {
  User.findOne({ email: email}, function (err, user){
    if(err) return done(err)
    if(!user) return done(null, false)

    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if(err) return done(err)
      if(!crypto.timingSafeEqual(user.pwdhash, hashedPassword)) {
        return done(null, false, { message: 'Incorrect username or password.' })
      }
      return done(null, user)
    })

  })
}

const options = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: false,
}

//  Добавление стратегии для использования
passport.use('local', new LocalStrategy(options, verify))

// Конфигурирование Passport для сохранения пользователя в сессии
passport.serializeUser(function (user, cb) {
  cb(null, user.id)
})

passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    if (err) { return cb(err) }
    cb(null, user)
  })
})

const app = express()

app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(cookieParser())
app.use(session({
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: null,
  },
  name: 'user.sid',
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())



const booksApi = require('./routes/api/books')
const userApi = require('./routes/api/user')
const booksWeb = require('./routes/web/books')
const userWeb = require('./routes/web/user')


const isAuthenticated = require('./middleware/isAuthenticated')
const error404 = require('./middleware/error404')
const error500 = require('./middleware/error500')

app.use(isAuthenticated)

app.use('/api/books', booksApi)
app.use('/api/user', userApi)
app.use('/books', booksWeb)
app.use('/user', userWeb)

app.use(error404)
app.use(error500)

app.get('/', (req, res) => {
  res.status(307).redirect('/books')
})



const PORT = process.env.PORT || 3000
const DBNAME = process.env.DB_NAME
const DBUSER = process.env.DB_USERNAME
const DBPASS = process.env.DB_PASSWORD
const DBURL = process.env.DB_URL

console.log(DBUSER)

;(async () => {
  try {
    await mongoose.connect(DBURL, {
      user: DBUSER,
      pass: DBPASS,
      dbName: DBNAME,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    app.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порту`))
  } catch(e) {
    console.log(e)
  }
})()