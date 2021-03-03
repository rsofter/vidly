const winston = require('winston');
require('winston-mongodb');
const config = require('config');
require('express-async-errors');

module.exports = function () {
	winston.exceptions.handle(
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'logs/uncaughtExceptions.log' })
	);

	process.on('unhandledRejection', (ex) => {
		throw ex;
	});

	winston.add(new winston.transports.File({ filename: 'logs/logfile.log' }));
	winston.add(new winston.transports.MongoDB({ db: config.get('db') }));
}