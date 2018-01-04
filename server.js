const express       = require('express');
const bodyParser    = require('body-parser');
var discoRoutes     = require("./app/api/routes/discoRoutes.js");
var collectionRoutes   = require("./app/api/routes/collectionRoutes.js");

const app = express();

app.use(bodyParser.json());
app.use((err, req, res, next) => {
    res.status(err.status).json(err);
});

const port = process.env.PORT || 3000;
const router = express.Router();

app.use('/', router);
discoRoutes(router);
collectionRoutes(router);

app.listen(port);
console.log('DiscoApp started on port ' + port);