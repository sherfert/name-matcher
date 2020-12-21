const _ = require('lodash');
const Name = require('./neo4j/name');

// get a single name
const get = function (session, name) {
    return session.readTransaction(txc =>
        txc.run('MATCH (name:Name {name: $name}) RETURN name AS name', {name: name})
    ).then(result => {
        if (!_.isEmpty(result.records)) {
            return new Name(result.records[0].get('name'));
        } else {
            throw {message: 'Name not found.', status: 404}
        }
    });
};

// add a new name
const create = function (session, name) {
    return session.writeTransaction(txc =>
        txc.run('MERGE (name:Name {name: $name}) RETURN name AS name', {name: name})
    ).then(result => new Name(result.records[0].get('name')));
};

module.exports = {
    get: get,
    create: create
};
