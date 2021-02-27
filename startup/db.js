const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');

module.exports = function () {
	mongoose.connect(config.get('database.mongodb'), {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
		.then(() => winston.info('Connected to MongoDB...'))
}