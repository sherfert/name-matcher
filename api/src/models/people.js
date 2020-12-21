const _ = require('lodash');
const Person = require('./neo4j/person');

// get a single person by name
const getByName = function (session, name) {
    return session.readTransaction(txc =>
        txc.run('MATCH (person:Person {name: $name}) RETURN person AS person', {name: name})
    ).then(result => {
        if (!_.isEmpty(result.records)) {
            return new Person(result.records[0].get('person'));
        } else {
            throw {message: 'User not found.', status: 404}
        }
    });
};

// get all people
const getAll = function (session) {
    return session.readTransaction(txc =>
        txc.run('MATCH (person:Person) RETURN person AS person')
    ).then(result => result.records.map(r => new Person(r.get('person'))));
};

// add a new person
const create = function (session, name) {
    return session.writeTransaction(txc =>
        txc.run('CREATE (person:Person {name: $name}) RETURN person AS person', {name: name})
    ).then(result => new Person(result.records[0].get('person')));
};

module.exports = {
    getAll: getAll,
    getByName: getByName,
    create: create
};
