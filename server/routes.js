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
		const spaces = await prisma.space.findMany({});
		res.json({
			spaces: spaces,
		});
	});

	app.get('/api/space/:id', async function (req, res) {
		const { id } = req.params;
		const space = await prisma.space.findMany({
			where: { id: Number(id) },
		});
		res.json({
			status: 200,
			space: space,
		});
	});

	app.get('/api/mySpace/:email', async function (req, res) {
		const { email } = req.params;
		const propertyOwner = await prisma.user.findMany({
			where: { email: String(email) },
		});
		const id = propertyOwner.id;
		console.log(id);
		const spaces = await prisma.space.findMany({
			where: { userId: id },
		});
		res.json({
			status: 200,
			user: propertyOwner,
			spaces: spaces,
		});
	});
};
