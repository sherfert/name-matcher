const _ = require('lodash');
const Person = require('../models/neo4j/person');

// get a single person by id
const getByName = function (session, name) {
  const query = [
    'MATCH (person:Person {name: $name})',
    'RETURN person AS person'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {name: name})
    ).then(result => {
      if (!_.isEmpty(result.records)) {
        return new Person(result.records[0].get('person'));
      }
      else {
        throw {message: 'person not found', status: 404}
      }
    });
};

// get all people
const getAll = function (session) {
  return session.readTransaction(txc =>
      txc.run('MATCH (person:Person) RETURN person')
    ).then(result => result.records.map(r => new Person(r.get('person'))));
};

module.exports = {
  getAll: getAll,
  getByName: getByName
};
