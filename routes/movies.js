const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const express = require('express');
const router = express.Router();

// Getting all movies
router.get('/', async (req, res) => {
	const movies = await Movie.find().sort('title');
	res.send(movies);
});

// Creating a new movie
router.post('/', async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const { title, genreId, numberInStock, dailyRentalRate } = req.body;

	const genre = await Genre.findById(genreId);
	if (!genre) return res.status(400).send('Invalid genre.');

	const movie = new Movie({
		title,
		genre: {
			_id: genre._id,
			name: genre.name
		},
		numberInStock,
		dailyRentalRate
	});

	await movie.save();
	res.send(movie);
});

// Updating a movie
router.put('/:id', async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const { title, genreId, numberInStock, dailyRentalRate } = req.body;

	const genre = await Genre.findById(genreId);
	if (!genre) return res.status(400).send('Invalid genre.');

	const movie = await Movie.findByIdAndUpdate(
		req.params.id,
		{
			title,
			genre: {
				_id: genre._id,
				name: genre.name
			},
			numberInStock,
			dailyRentalRate
		},
		{ new: true });

	if (!movie) return res.status(404).send('The movie with the given ID was not found.');

	res.send(movie);
});

// Deleting a movie
router.delete('/:id', async (req, res) => {
	const movie = await Movie.findByIdAndDelete(req.params.id);

	if (!movie) return res.status(404).send('The movie with the given ID was not found.');

	res.send(movie);
});

// Getting a single movie
router.get('/:id', async (req, res) => {
	const movie = await Movie.findById(req.params.id);

	if (!movie) return res.status(404).send('The movie with the given ID was not found.');

	res.send(movie);
});

module.exports = router;