const Names = require('../models/names')
  , writeResponse = require('../helpers/response').writeResponse
  , dbUtils = require('../neo4j/dbUtils');

exports.get = function (req, res, next) {
  const name = req.params.name;
  if (!name) throw {message: 'Invalid name.', status: 400};
  const mode = req.query.mode;

  const sexes = req.query.sexes ? JSON.parse(req.query.sexes).list : undefined;

  const session = dbUtils.getSession(req);
  let promise;
  switch (mode) {
    case "prefix":
      if(!sexes || sexes.some(sex => sex !== "boy" && sex !== "girl" && sex !== "neutral")) throw {message: `Invalid sexes: ${sexes}.`, status: 400};
      promise = Names.prefixSearch(session, name, sexes);
      break;
    case "suffix":
      if(!sexes || sexes.some(sex => sex !== "boy" && sex !== "girl" && sex !== "neutral")) throw {message: `Invalid sexes: ${sexes}.`, status: 400};
      promise = Names.suffixSearch(session, name, sexes);
      break;
    case "contains":
      if(!sexes || sexes.some(sex => sex !== "boy" && sex !== "girl" && sex !== "neutral")) throw {message: `Invalid sexes: ${sexes}.`, status: 400};
      promise = Names.containsSearch(session, name, sexes);
      break;
    case "exact":
    case undefined:
      promise = Names.exactSearch(session, name);
      break;
    default:
      throw {message: `Invalid mode: ${mode}.`, status: 400};
  }

  promise
      .then(response => writeResponse(res, response))
      .catch(next);
};

exports.getWithRating = function (req, res, next) {
  const user = req.query.user;
  if (!user) throw {message: 'Invalid user name.', status: 400};
  const name = req.params.name;
  if (!name) throw {message: 'Invalid name.', status: 400};
  const mode = req.query.mode;

  const sexes = req.query.sexes ? JSON.parse(req.query.sexes).list : undefined;

  const session = dbUtils.getSession(req);
  let promise;
  switch (mode) {
    case "prefix":
      if(!sexes || sexes.some(sex => sex !== "boy" && sex !== "girl" && sex !== "neutral")) throw {message: `Invalid sexes: ${sexes}.`, status: 400};
      promise = Names.prefixSearchWithRating(session, user, name, sexes);
      break;
    case "suffix":
      if(!sexes || sexes.some(sex => sex !== "boy" && sex !== "girl" && sex !== "neutral")) throw {message: `Invalid sexes: ${sexes}.`, status: 400};
      promise = Names.suffixSearchWithRating(session, user, name, sexes);
      break;
    case "contains":
      if(!sexes || sexes.some(sex => sex !== "boy" && sex !== "girl" && sex !== "neutral")) throw {message: `Invalid sexes: ${sexes}.`, status: 400};
      promise = Names.containsSearchWithRating(session, user, name, sexes);
      break;
    case "exact":
    case undefined:
      promise = Names.exactSearchWithRating(session, user, name);
      break;
    default:
      throw {message: `Invalid mode: ${mode}.`, status: 400};
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

exports.import = function (req, res, next) {
  Names.loadCSV(dbUtils.getSession(req), req.file.filename)
      .then(response => writeResponse(res, response))
      .catch(next);
};

exports.rate = function (req, res, next) {
  const user = req.body.user;
  if (!user || typeof user !== "string") throw {message: `Invalid user name: ${user}.`, status: 400};
  const name = req.params.name;
  if (!name) throw {message: 'Invalid name.', status: 400};
  const rating = req.body.rating;
  if (!rating || typeof rating !== "number" || rating % 1 !== 0) throw {message: `Invalid rating: ${rating}.`, status: 400};


  Names.rate(dbUtils.getSession(req), user, name, rating)
      .then(response => writeResponse(res, response))
      .catch(next);
};