const { prisma } = require('.prisma/client');

// var notesRouter = new router({
// 	prefix: '/api/v1',
// });

module.exports = function (app, authMiddleware) {
	app.get('/', (req, res) => {
		res.send('Hello World!');
	});

	// This route doesn't need authentication
	app.get('/api/v1/public', function (req, res) {
		res.json({
			message:
				"Hello from a public endpoint! You don't need to be authenticated to see this.",
		});
	});

	// This route needs authentication
	app.get('/api/v1/private', authMiddleware, function (req, res) {
		res.json({
			message: 'Valid token',
			status: 200,
			first_name: req.user.first_name,
		});
	});

	app.get('/api/v1/spaces', async function (req, res) {
		const spaces = await prisma.Space.findMany({});
		res.json({
			message: 'Valid token',
			status: 200,
			name: req.space.name,
			space: spaces,
		});
	});
};

//module.exports = notesRouter.routes();
