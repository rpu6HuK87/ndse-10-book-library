const express = require('express')
const redis = require('redis')

const PORT = process.env.PORT || 80
const REDIS_URL = process.env.REDIS_URL || 'redis://storage:6379'

console.log(REDIS_URL)

const app = express();
const client = new redis.createClient({ url: REDIS_URL });

(async () => {  
  await client.connect()
})()

app.post('/counter/:bookid/incr', async (req, res) => {
  const { bookid } = req.params
  try {
    const count = await client.incr(bookid)
    //console.log(count)
    res.json({count: count})
    
  } catch(err) {
    res.status(500).json({error: true, code: 500, msg: 'Ошибка REDIS', payload: err})
  }
})

app.get('/counter/:bookid', async (req, res) => {
  const { bookid } = req.params
  //console.log(bookid)
  const count = await client.get(bookid, redis.print)
  res.json({count: count})
})

app.listen(PORT, () => console.log(`BOOKСOUTER listen on ${PORT} port`))