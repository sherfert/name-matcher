require("dotenv").config();

const express = require("express"),
    routes = require("./src/routes"),
    nconf = require("./config"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    neo4jSessionCleanup = require("./src/middlewares/neo4jSessionCleanup"),
    writeError = require("./src/helpers/response").writeError,
    startup = require('./src/neo4j/startup'),
    multer = require('multer');

const app = express(),
    api = express();

const upload = multer({ dest: nconf.get("neo4j-import-path") });

app.use(nconf.get("api_path"), api);

app.set("port", nconf.get("PORT"));

api.use(bodyParser.json());
api.use(methodOverride());

//enable CORS
api.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//api custom middlewares:
api.use(neo4jSessionCleanup);

// Create constraints and indexes
startup.createDBConstraintsAndIndexes();

//api routes
api.get("/people", routes.people.list);
api.get("/people/:name", routes.people.findByName);
api.post("/people/:name", routes.people.create);

api.get("/names/:name", routes.names.get);
api.post("/names/:name", routes.names.create);
api.post("/names-import/", upload.single('file'), routes.names.import);

api.post("/names/:name/rating", routes.names.rate);
api.get("/names/:name/rating", routes.names.getWithRating);

//api error handler
api.use(function (err, req, res, next) {
  if (err && err.status) {
    writeError(res, err);
  } else next(err);
});

module.exports = app;
