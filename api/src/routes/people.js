const People = require('../models/people')
  , writeResponse = require('../helpers/response').writeResponse
  , dbUtils = require('../neo4j/dbUtils');

exports.list = function (req, res, next) {
  People.getAll(dbUtils.getSession(req))
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.findByName = function (req, res, next) {
  const name = req.params.name;
  if (!name) throw {message: 'Invalid name', status: 400};

  People.getByName(dbUtils.getSession(req), name)
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.create = function (req, res, next) {
  const name = req.params.name;
  if (!name) throw {message: 'Invalid name', status: 400};

  People.create(dbUtils.getSession(req), name)
      .then(response => writeResponse(res, response))
      .catch(r => {
        if (r.message.includes("already exists with label `Person` and property `name`")) {
          next({message: 'User already exists.', status: 400});
        } else {
          next(r);
        }
      });
};