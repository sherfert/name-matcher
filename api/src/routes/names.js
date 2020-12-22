const Names = require('../models/names')
  , writeResponse = require('../helpers/response').writeResponse
  , dbUtils = require('../neo4j/dbUtils');

exports.get = function (req, res, next) {
  const name = req.params.name;
  if (!name) throw {message: 'Invalid name.', status: 400};

  Names.get(dbUtils.getSession(req), name)
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