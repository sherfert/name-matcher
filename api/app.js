require("dotenv").config();

const express = require("express"),
    routes = require("./routes"),
    nconf = require("./config"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    neo4jSessionCleanup = require("./middlewares/neo4jSessionCleanup"),
    writeError = require("./helpers/response").writeError,
    dbUtils = require('./neo4j/dbUtils');

const app = express(),
    api = express();

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
const session = dbUtils.driver.session();//getSession(api.request);
session.writeTransaction(txc =>
    txc.run("CREATE CONSTRAINT person_name IF NOT EXISTS ON (p:Person) ASSERT (p.name) IS NODE KEY")
).catch(err => console.log(err));

//api routes
api.get("/people", routes.people.list);
api.get("/people/:name", routes.people.findByName);
api.post("/people/:name", routes.people.create)

//api error handler
api.use(function (err, req, res, next) {
  if (err && err.status) {
    writeError(res, err);
  } else next(err);
});

app.listen(app.get("port"), () => {
  console.log(
    "Express server listening on port " + app.get("port")
  );
});
