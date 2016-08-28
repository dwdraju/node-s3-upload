const express = require('express');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

var fs = require('fs'), 
	zlib = require('zlib');

var body = fs.createReadStream('largeFile').pipe(zlib.createGzip());
 
// Upload the stream
var s3obj = new AWS.S3({params: {Bucket: 'mybucket345345', Key: 'myKey'}});
s3obj.upload({Body: body}).
  on('httpUploadProgress', function(evt) {
    console.log('Progress:', evt.loaded, '/', evt.total); 
  }).
  send(function(err, data) { console.log(err, data) });