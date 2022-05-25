import mongoose from 'mongoose'

const options = {
	user: process.env.DB_USERNAME,
	pass: process.env.DB_PASSWORD,
	dbName: process.env.DB_NAME,
	useNewUrlParser: true,
	useUnifiedTopology: true
}

mongoose.connect(process.env.DB_URL, options)
mongoose.connection.on('open', () => console.log('Подключение к БД установлено'))