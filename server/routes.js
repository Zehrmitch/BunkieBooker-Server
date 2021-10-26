const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function (app, authMiddleware) {
	app.get('/', (req, res) => {
		res.send('Hello World!');
	});

	// This route doesn't need authentication
	app.get('/api/public', function (req, res) {
		res.json({
			message:
				"Hello from a public endpoint! You don't need to be authenticated to see this.",
		});
	});

	// This route needs authentication
	app.get('/api/private', authMiddleware, function (req, res) {
		res.json({
			message: 'Valid token',
			status: 200,
			first_name: req.user.first_name,
		});
	});

	app.get('/api/users', async function (req, res) {
		const users = await prisma.user.findMany({});
		res.json({
			message: 'Valid token',
			status: 200,
			user: users,
		});
	});
};
