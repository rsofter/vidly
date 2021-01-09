
const express = require('express');
const router = express.Router();

let courses = [
	{ id: 1, name: 'Course 1' },
	{ id: 2, name: 'Course 2' },
	{ id: 3, name: 'Course 3' }
];

// Getting all courses
router.get('/', (req, res) => {
	res.send(courses);
});

// Getting a single course
router.get('/:id', (req, res) => {
	const course = courses.find(course => course.id === parseInt(req.params.id));
	if (!course) return res.status(404).send('The course with the given ID was not found.');

	res.send(course);
});

// Creating a new course
router.post('/', (req, res) => {
	const { error } = validateCourse(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const course = {
		id: courses.length + 1,
		name: req.body.name
	};
	courses.push(course);
	res.send(course);
});

// Updating a course
router.put('/:id', (req, res) => {
	const course = courses.find(course => course.id === parseInt(req.params.id));
	if (!course) return res.status(404).send('The course with the given ID was not found.');

	const { error } = validateCourse(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	course.name = req.body.name;
	res.send(course);
});


// Deleting a course
router.delete('/:id', (req, res) => {
	const course = courses.find(course => course.id === parseInt(req.params.id));
	if (!course) return res.status(404).send('The course with the given ID was not found.');

	const index = courses.indexOf(course);
	courses.splice(index, 1);

	res.send(course);
});

function validateCourse(course) {
	const schema = Joi.object({
		name: Joi.string().min(3).required()
	});

	return schema.validate(course);
}

module.exports = router;