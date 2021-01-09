const debug = require('debug')('app:startup');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');
const logger = require('./logger');
const express = require('express');
const app = express();

app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

console.log(`Application Name: ${config.get('name')}`);
console.log(`Mail Server: ${config.get('mail.host')}`);
console.log(`Mail Password: ${config.get('mail.password')}`);

if (app.get('env') === 'development') {
	app.use(morgan('tiny'));
	debug('Morgan enabled...');
}

let genres = [
	{ id: 1, name: 'Genre 1' },
	{ id: 2, name: 'Genre 2' },
	{ id: 3, name: 'Genre 3' }
]

app.get('/', (req, res) => {
	res.render('index', { title: 'My Express App', message: 'Hello' });
});

// Getting all genres
app.get('/api/genres', (req, res) => {
	res.send(genres);
});

// Getting a single genre
app.get('/api/genres/:id', (req, res) => {
	const genre = genres.find(genre => genre.id === parseInt(req.params.id));
	if (!genre) return res.status(404).send('The genre with the given ID was not found.');

	res.send(genre);
});

// Creating a new genre
app.post('/api/genres', (req, res) => {
	const { error } = validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = {
		id: genres.length + 1,
		name: req.body.name
	};
	genres.push(genre);
	res.send(genre);
});

// Updating a genre
app.put('/api/genres/:id', (req, res) => {
	const genre = genres.find(genre => genre.id === parseInt(req.params.id));
	if (!genre) return res.status(404).send('The genre with the given ID was not found.');

	const { error } = validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	genre.name = req.body.name;
	res.send(genre);
});


// Deleting a genre
app.delete('/api/genres/:id', (req, res) => {
	const genre = genres.find(genre => genre.id === parseInt(req.params.id));
	if (!genre) return res.status(404).send('The genre with the given ID was not found.');

	const index = genres.indexOf(genre);
	genres.splice(index, 1);

	res.send(genre);
});

function validateGenre(genre) {
	const schema = Joi.object({
		name: Joi.string().min(3).required()
	});

	return schema.validate(genre);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));