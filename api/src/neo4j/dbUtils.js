"use strict";

// neo4j cypher helper module
const nconf = require('../../config');

const neo4j = require('neo4j-driver');
const driver = neo4j.driver(nconf.get('neo4j-local'), neo4j.auth.basic(nconf.get('USERNAME'), nconf.get('PASSWORD')), {disableLosslessIntegers: true});

exports.getSession = function (context) {
  if(context.neo4jSession) {
    return context.neo4jSession;
  }
  else {
    context.neo4jSession = driver.session();
    return context.neo4jSession;
  }
};
exports.driver = driver;