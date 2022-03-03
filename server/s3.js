require('dotenv').config();
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_LOCATION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAcessKey = process.env.AWS_SECRET_ACCESS_KEY;
var aws = require('aws-sdk');

// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
	region: region,
	accessKeyId: accessKeyId,
	secretAccessKey: secretAcessKey,
});

// Now lets export this function so we can call it from somewhere else
exports.sign_s3 = (req, res) => {
	const s3 = new aws.S3();

	const fileName = req.body.fileName;
	const fileType = req.body.fileType;
	// Set up the payload of what we are sending to the S3 api
	const s3Params = {
		Bucket: bucketName,
		Key: fileName,
		Expires: 500,
		ContentType: fileType,
		ACL: 'public-read',
	};
	// Make a request to the S3 API to get a signed URL which we can use to upload our file
	s3.getSignedUrl('putObject', s3Params, (err, data) => {
		if (err) {
			console.log(err);
			res.json({ success: false, error: err });
		}
		// Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
		const returnData = {
			signedRequest: data,
			url: `https://${bucketName}.s3.amazonaws.com/${fileName}`,
		};
		// Send it all back
		res.json({ success: true, data: { returnData } });
	});
};
