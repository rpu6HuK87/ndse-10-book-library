const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')

const User = require('./models/User')
const salt = process.env.SALT || "solenayaSol'"
console.log(salt)

function verify(email, password, done) {
  User.findOne({ email: email}, function (err, user) {
    if(err) return done(err)
    if(!user) return done(null, false, {message: 'Неверные логин или пароль'})
    bcrypt.compare(password, user.pwdhash, function(err, result) {
      if(err) return done(err)
      if(result) return done(null, user)
      else return done(null, false, { message: 'Неверные логин или пароль' })
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

app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

const sessionMW = session({
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
})
app.use(sessionMW)
io.use((socket, next) => {sessionMW(socket.request, {}, next)})

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

app.get('/', (req, res) => {
  res.status(307).redirect('/books')
})
app.get('/logout',  (req, res) => {
  req.logout()
  res.redirect('/user/login')
})

//WS
io.on('connection', async (socket) => {
  const { id } = socket
  const uid = socket.request.session.passport.user
  const user = await User.findById(uid)
  console.log(`Веб-сокет клиент с ID ${id} подключился`)

  
  console.log(user)

  // подключение к комнате книги
  const { roomName } = socket.handshake.query
  console.log(`Подключение к комнате ${roomName}`)
  socket.join(roomName)
  socket.on('message-to-room', (msg) => {
    msg.type = `room: ${roomName}`
    socket.to(roomName).emit('message-to-room', msg)
    //socket.emit('message-to-room', msg)
  })

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${id}`)
  })
})

app.use(error404)
app.use(error500)

const PORT = process.env.PORT || 3000
const DBNAME = process.env.DB_NAME
const DBUSER = process.env.DB_USERNAME
const DBPASS = process.env.DB_PASSWORD
const DBURL = process.env.DB_URL

;(async () => {
  try {
    await mongoose.connect(DBURL, {
      user: DBUSER,
      pass: DBPASS,
      dbName: DBNAME,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    server.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порту`))
  } catch(e) {
    console.log(e)
  }
})()