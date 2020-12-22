const Names = require('../models/names')
  , writeResponse = require('../helpers/response').writeResponse
  , dbUtils = require('../neo4j/dbUtils');

exports.get = function (req, res, next) {
  const name = req.params.name;
  if (!name) throw {message: 'Invalid name.', status: 400};
  const mode = req.body.mode;

  const session = dbUtils.getSession(req);

  let promise;
  switch (mode) {
    case "prefix":
      promise =  Names.prefixSearch(session, name);
      break;
    case "suffix":
      promise =  Names.suffixSearch(session, name);
      break;
    case "exact":
    default:
      promise =  Names.get(session, name);
      break;
  }

  promise
      .then(response => writeResponse(res, response))
      .catch(next);
};

exports.create = function (req, res, next) {
  const name = req.params.name;
  if (!name) throw {message: 'Invalid name.', status: 400};
  const sex = req.body.sex;
  if (sex !== "boy" && sex !== "girl" && sex !== "neutral") throw {message: `Invalid sex: ${sex}.`, status: 400};

  Names.create(dbUtils.getSession(req), name, sex)
      .then(response => writeResponse(res, response))
      .catch(next);
};