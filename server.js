const express = require('express'),
      bodyParser = require('body-parser'),
      fs = require('fs');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

var filename = process.argv[3] || 'post.json';


app.get('/posts', function(req, res) {
    fs.readFile(filename, function(err, data) {
	if (err) return res.send(500);
	try {
	    posts = JSON.parse(data);
	} catch(e) {
	    res.send(500);
	}
	res.json(posts);
    });
});

app.post('/posts', function(req, res) {
    var newPost = { "title": req.body.title,
		    "body": req.body.body};
    fs.readFile(filename, function(err, data) {
	if (err) throw err;
	
	fs.writeFile(
	    filename,
	    data.toString().substring(0, data.toString().length - 2) + ',' +
		JSON.stringify(newPost, null, 4) + ' ]',
	    function(err) {
		if (err) throw err;
		res.send(newPost);
	    });
    });
});

app.listen(process.argv[2] || 8080);
