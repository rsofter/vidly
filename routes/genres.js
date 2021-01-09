
const express = require('express');
const router = express.Router();

let genres = [
	{ id: 1, name: 'Genre 1' },
	{ id: 2, name: 'Genre 2' },
	{ id: 3, name: 'Genre 3' }
];

// Getting all genres
router.get('/', (req, res) => {
	res.send(genres);
});

// Getting a single genre
router.get('/:id', (req, res) => {
	const genre = genres.find(genre => genre.id === parseInt(req.params.id));
	if (!genre) return res.status(404).send('The genre with the given ID was not found.');

	res.send(genre);
});

// Creating a new genre
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
	const genre = genres.find(genre => genre.id === parseInt(req.params.id));
	if (!genre) return res.status(404).send('The genre with the given ID was not found.');

	const { error } = validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	genre.name = req.body.name;
	res.send(genre);
});


// Deleting a genre
router.delete('/:id', (req, res) => {
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

module.exports = router;