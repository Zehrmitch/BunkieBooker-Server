const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const pino = require('express-pino-logger');
require('dotenv').config();
app.use(cors());
app.use(express.json());
//app.use(pino());
var sign_s3 = require('./s3');

var jwtCheck = jwt({
	secret: jwks.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: 'https://dev-yavkg45z.us.auth0.com/.well-known/jwks.json',
	}),
	audience: 'https://api.bunkiebooker.com',
	issuer: 'https://dev-yavkg45z.us.auth0.com/',
	algorithms: ['RS256'],
});

var errorCheck = function (err, req, res, next) {
	console.log('error check');
	if (err.name === 'UnauthorizedError') {
		res.status(401).json({ message: 'Invalid token', status: 401 });
	}
	next();
};

var setUser = async function (req, res, next) {
	console.log('set user');
	if (req.user.sub === process.env.TEST_SUB) {
		// Check if test token
		req.user = {
			...req.user, // Spread op
			name: 'Jane Doe',
			given_name: 'Jane',
			family_name: 'Doe',
			gender: 'female',
			birthdate: '0000-10-31',
			email: 'janedoe@example.com',
		};
	}

	console.log(req);
	const user = await prisma.user.findUnique({
		where: {
			email: req.user.email,
		},
	});

	if (!user) {
		user = await prisma.user.create({
			data: {
				first_name: req.user.given_name,
				last_name: req.user.family_name,
				email: req.user.email,
			},
		});
	}

	req.user = user;
	next(req);
};

const authMiddleware = [jwtCheck, errorCheck, setUser];

require('./routes')(app, authMiddleware, prisma);

app.use('/sign_s3', sign_s3.sign_s3);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
