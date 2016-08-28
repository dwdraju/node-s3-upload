/*
 * Install packages with "npm install"
 */
const express = require('express');
const aws = require('aws-sdk');
aws.config.loadFromPath('./config.json');

/*
 * Set-up and run the Express app
 */
const app = express();
app.set('views', './views');
app.use(express.static('./public'));
app.engine('html', require('ejs').renderFile);
app.listen(process.env.PORT || 3000);

/*
 * Respond to GET requests to /upload-image.
 * Upon request, render 'upload-image.html' web page in views/ directory.
 */
app.get('/upload-image', (req, res) => res.render('upload-image.html'));

/*
 * Respond to GET requests to /sign-s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */
app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3({params: {Bucket: 'mybucket345345'}});
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const S3_BUCKET = s3.config.params.Bucket;
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

/*
 * Respond to POST requests to /save.
 */
app.post('/save', (req, res) => {
  // TODO: Read POSTed form data and do something useful
});
