var express = require('express');
var port = process.env.PORT || 8000;
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');


var app = express();

// configuration ===============================================================
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/static', express.static(path.join(__dirname, 'static')));
//
// log every request to the console
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

app.set('baseDir', __dirname);


app.get('*', function (req, res, next) {
    res.sendFile(path.resolve(__dirname + '/static/assets/templates/index.html'));
});


// listening  ==================================================================
app.listen(port);
console.log("App listening on port " + port);
