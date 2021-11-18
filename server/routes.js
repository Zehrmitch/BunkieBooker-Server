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

	app.get('/api/spaces', async function (req, res) {
		const spaces = await prisma.space.findMany({
			include: {
				images: true,
				location: true,
			},
		});
		res.json({
			spaces: spaces,
		});
	});

	app.get('/api/space/:id', async function (req, res) {
		const { id } = req.params;
		const space = await prisma.space.findMany({
			where: { id: Number(id) },
			include: {
				images: true,
				location: true,
			},
		});
		res.json({
			space: space,
		});
	});

	app.get('/api/mySpaces/:id', async function (req, res) {
		const { id } = req.params;
		const spaces = await prisma.space.findMany({
			where: { userId: Number(id) },
		});
		res.json({
			status: 200,
			spaces: spaces,
		});
	});
};
