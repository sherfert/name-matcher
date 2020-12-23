const _ = require('lodash');

// get a single person by name
const getByName = function (session, name) {
    return session.readTransaction(txc =>
        txc.run(
            `MATCH (person:Person {name: $name}) 
             RETURN properties(person) AS person`,
            {name: name})
    ).then(result => {
        if (!_.isEmpty(result.records)) {
            return result.records[0].get('person');
        } else {
            throw {message: 'User not found.', status: 404}
        }
    });
};

// get all people
const getAll = function (session) {
    return session.readTransaction(txc =>
        txc.run(
            `MATCH (person:Person) 
             RETURN properties(person) AS person`)
    ).then(result => result.records.map(r => r.get('person')));
};

// add a new person
const create = function (session, name) {
    return session.writeTransaction(txc =>
        txc.run(
            `CREATE (person:Person {name: $name}) 
             RETURN properties(person) AS person`,
            {name: name})
    ).then(result => result.records[0].get('person'));
};

module.exports = {
    getAll: getAll,
    getByName: getByName,
    create: create
};
