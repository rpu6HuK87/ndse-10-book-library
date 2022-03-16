const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

const redis = require('redis')
const REDIS_URL = process.env.REDIS_URL || 'redis://storage:6379'
const client = new redis.createClient({ url: REDIS_URL })
console.log(REDIS_URL)

;(async () => {  
  await client.connect()
})()



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
//
io.use((socket, next) => {sessionMW(socket.request, {}, next)})





const isAuthenticated = require('./middleware/isAuthenticated')
const error404 = require('./middleware/error404')
const error500 = require('./middleware/error500')



app.use(passport.initialize())
app.use(passport.session())
app.use(isAuthenticated)

const booksApi = require('./routes/api/books')
const userApi = require('./routes/api/user')
const booksWeb = require('./routes/web/books')
const userWeb = require('./routes/web/user')

app.use('/api/books', booksApi)
app.use('/api/user', userApi)
app.use('/books', booksWeb)
app.use('/user', userWeb)

app.use('/static', express.static(__dirname + '/public/assets'))

app.get('/', (req, res) => {
  res.status(307).redirect('/books')
})
app.get('/logout',  (req, res) => {
  req.logout()
  res.redirect('/user/login')
})

//WS
let connectedClients = []
io.on('connection', async (socket) => {
  
  const { id } = socket
  const sess = socket.request.session
  const user = (sess.passport?.user) ? await User.findById(sess.passport.user) : false
  if(!user) {
    socket.emit('logout-client')
    return
  }
  console.log(`Веб-сокет клиент с ID ${id} подключился`)
  
  // подключение к комнате книги
  const { roomName } = socket.handshake.query
  console.log(`Подключение к комнате ${roomName}`)
  socket.join(roomName)
  if(roomName in connectedClients)  connectedClients[roomName].push(user.name)
  else connectedClients[roomName] = [user.name]
  //await client.del(roomName)
  let allmsgs
  try {
    allmsgs = await client.lRange('wsroom_' + roomName, 0, -1)
  } catch {
    await client.del('wsroom_' + roomName)
    allmsgs = false
  }
  
  //if(allmsgs) await client.del(roomName)
  //console.log(allmsgs)
  socket.emit('all-messages', {allmsgs, yourname: user.name, userlist: connectedClients[roomName]})
  socket.to(roomName).emit('someone-connected-disconnected', connectedClients[roomName])

  socket.on('message-to-room', (msg) => {
    msg.username = user.name ? user.name : 'Некто'    
    socket.emit('message-to-room-sended')
    socket.to(roomName).emit('message-to-room', msg)
    //socket.emit('message-to-room', msg)
    client.rPush('wsroom_' + roomName, JSON.stringify(msg))
  })

  socket.on('disconnect', () => {
    connectedClients[roomName] = connectedClients[roomName].filter(name => name != user.name)
    socket.to(roomName).emit('someone-connected-disconnected', connectedClients[roomName])
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