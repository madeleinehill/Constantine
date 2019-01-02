// node.js server that implements basic commands
// necessary for an AJAX application.

// I took ***some*** inspiration from here
// https://github.com/reactjs/react-tutorial/blob/master/server.js
// there are also other implementations for servers in other environments there,
// like server.py (using FLASK)... cool stuff

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 8000));

app.use('/', express.static(path.join(__dirname, 'public'), {index: 'scry.html'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// "Additional middleware which will set headers that we need on each request."
app.use(function(req, res, next){
    // "Set permissive CORS header - this allows this server to be used only
    // as an API server in conjunction with something like webpack-dev-server"
    res.setHeader('Access-Control-Allow-Origin', '*');

    // "Disable caching so we'll always get the latest comments".
    // This should be useful to avoid missing the latest changes when developing
    // the app.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});


// This didn't work for routing towards scry.html rather than
// looking for index.html ...
// app.get('*', (req, res, next) => {
//     res.sendFile('scry.html');
//     next();
// });
// Adding {index: 'scry.html'} in the options parameter did the job!


// instead of app.get('port') only... use 
app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});

