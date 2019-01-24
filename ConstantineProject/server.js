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


function getModel() {
    return require(`./public/agents/model-${require('./config').get('DATA_BACKEND')}`);
}



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


// Retrieve existing agents (right now limited to 10)
app.get('/agents.datastore', function(req, res) {
    
    getModel().list(10, req.query.pageToken, (err, entities, cursor) => {
        if (err) {
            next(err);
            return;
        }
        //console.log("entities in server");
        //console.log(entities);
        res.send(entities);
    });


    
});


/**
 * POST createAgent.datastore
 * 
 * Create a new agent
 */
app.post('/createAgent.datastore', (req, res, next) => {

    console.log("/createAgent.datastore")

    
    console.log("req.body");
    console.log(req.body);
    console.log(req.body.name);
    //console.log(req.name); this crashes everything

    console.log("content");
    console.log(req.body.content);

    
    // It is already parsed!!!
    /*console.log("parsed json");    
    console.log(JSON.parse(req.body));*/


    let name = req.body.name;
    let type = req.body.type || "event";
    console.log("type");
    console.log(type);
    let yearRange = [req.body.yearRange1, req.body.yearRange2];
    let coordinates = [req.body.coordinates1, req.body.coordinates2];
    let description = "./data/descriptions/constantinehailed.description.txt";
    let descriptionAtt = "<a href = 'https://en.wikipedia.org/wiki/Constantine_the_Great' target='_blank'>Content from Wikipedia  (modified)</a>";
    let picture = "./data/pictures/rome.picture.txt";
    let pictureAtt = "<a href = 'https://en.wikipedia.org/wiki/Rome#/media/File:Trajansm%C3%A4rkte_Forum.jpg' target='_blank'>Content from Wikipedia</a>";
    let iconUrl = "./agents/icons/rome.png";

    let dataObj = {
        "name": name,
        "type": type,
        "yearRange": yearRange,
        "content": [{"title": "Description",
                    "source": description,
                    "att": descriptionAtt},
                    {"title": "Picture",
                    "source": picture,
                    "att": pictureAtt}],
        "coordinates": coordinates,
        "iconUrl": iconUrl
    };




    
    getModel().create(/*req.body*/dataObj, (err, entity) => {
        if (err) {
            next(err);
            return;
        }
        res.json(entity); // or res.send(entity); ?
        console.log("It worked out");
    });
});


/**
 * PUT updateAgent.datastore - changed to POST
 * 
 * Update an agent
*/
app./*put*/post('/updateAgent.datastore/:agentID/', (req, res, next) => {

    console.log("/updateAgent.datastore");

    /*console.log("req.params.agent");
    console.log(req.params.agent);*/
    console.log("req.body");
    console.log(req.body);

    let name = req.body.name;
    let type = req.body.type || "event";
    console.log("type");
    console.log(type);
    let yearRange = [req.body.yearRange1, req.body.yearRange2];
    let coordinates = [req.body.coordinates1, req.body.coordinates2];
    let description = "./data/descriptions/constantinehailed.description.txt";
    let descriptionAtt = "<a href = 'https://en.wikipedia.org/wiki/Constantine_the_Great' target='_blank'>Content from Wikipedia  (modified)</a>";
    let picture = "./data/pictures/rome.picture.txt";
    let pictureAtt = "<a href = 'https://en.wikipedia.org/wiki/Rome#/media/File:Trajansm%C3%A4rkte_Forum.jpg' target='_blank'>Content from Wikipedia</a>";
    let iconUrl = "./agents/icons/rome.png";

    let dataObj = {
        "name": name,
        "type": type,
        "yearRange": yearRange,
        "content": [{"title": "Description",
                    "source": description,
                    "att": descriptionAtt},
                    {"title": "Picture",
                    "source": picture,
                    "att": pictureAtt}],
        "coordinates": coordinates,
        "iconUrl": iconUrl
    };

    getModel().update(req.params.agentID, dataObj/*req.body*/, (err, entity) => {
        if (err) {
            next(err);
            return;
        }
        res.json(entity); // or res.send(entity); ?
    });
});


/**
 * DELETE
 * 
 * Delete a book
 */

app.delete('/delAgent.datastore/:agentID/', (req, res, next) => {

    console.log("Delete method called");

    getModel().delete(req.params.agentID, err => {
        if (err) {
            next(err);
            return;
        }

        console.log("Deleted agent from datastore sucessfully");
        res.status(200).send('OK');
    });
 });


/**
 * GET 
 * 
 * Retrieve an agent.
 * 
 */
app.get('/readAgent.datastore/:agentID/', (req, res, next) => {
    console.log("readAgent.datastore");
    console.log(req.params.agentID);
    getModel().read(req.params.agentID, (err, entity) => {
        if (err) {
            next(err);
            return;
        }
        res.json(entity);
    });
});




// instead of app.get('port') only... use 
app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});

