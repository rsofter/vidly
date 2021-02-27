require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const error = require('./middleware/error');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const config = require('config');
const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();

process.on('uncaughtException', (ex) => {
	winston.error(ex.message, { metadata: ex });
	process.exit(1);
});

process.on('unhandledRejection', (ex) => {
	winston.error(ex.message, ex);
	process.exit(1);
});

winston.add(new winston.transports.File({ filename: 'logs/logfile.log' }));
winston.add(new winston.transports.MongoDB({ db: config.get('database.mongodb') }));

if (!config.get('jwtPrivateKey')) {
	console.error('FATAL ERROR: jwtPrivateKey is not defined.');
	process.exit(1);
}

mongoose.connect(config.get('database.mongodb'), {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(() => console.log('Connected to MongoDB...'))
	.catch((err) => console.log('Could not connect to MongoDB...', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));