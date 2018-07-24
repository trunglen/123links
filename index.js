const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const functions = require('firebase-functions');
var userApi = require('./api/users')
var linkApi = require('./api/123links')
var postApi = require('./api/posts')
var tokenApi = require('./api/tokens')
var fanpageApi = require('./api/fanpages')
var http = require('http');
// exports.helloWorld = functions.https.onRequest((request, response) => {
//     response.send(albums);
// });
const app = express();
app.use(bodyParser.json());
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use('/users', userApi);
app.use('/link', linkApi);
app.use('/posts', postApi);
app.use('/tokens', tokenApi);
app.use('/fanpages', fanpageApi);
app.get('/website-speed', function (req, res) {
    // const website = req.query('website');
    const start = new Date().getTime()
    var data = [];
    http.get(req.query.website, (response) => {
        response.on("data", (c) => {
            data.push(c);
        }).on("end", () => {
            var buffer = Buffer.concat(data);
            const timing = new Date().getTime() - start;
            res.send({ url: req.query.website, timing: timing, size: buffer.byteLength });
        })

    }).on("error", (err) => {
        res.status(400).send({ err: err.message });
    });
})
app.listen(4000);
// exports.api = functions.https.onRequest(app);
