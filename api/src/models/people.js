const {int} = require('neo4j-driver/lib/integer');
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

// Next name to rate
const nextNamesToRate = function (session, user, sexes, limit) {
    return session.readTransaction(txc =>
        txc.run(
            `CYPHER runtime=slotted // Bug in pipelined if sexes=[]
             MATCH (user:Person {name: $user}), (name:Name)
               WHERE NOT (user)-[:RATING]->(name) AND name.sex IN $sexes
             CALL {
               WITH name, user
               OPTIONAL MATCH (otherUser:Person)-[rating:RATING]->(name)
                 WHERE otherUser <> user
               WITH avg(rating.stars) AS avgRating
               RETURN (CASE 
                       WHEN avgRating IS NULL THEN 3.0
                       ELSE avgRating
                       END) AS avgRating
             }
             RETURN properties(name) AS name
               ORDER BY avgRating DESC 
               LIMIT $limit`,
            {user: user, sexes: sexes, limit: int(limit)})
    ).then(result => result.records.map(r => r.get('name')));
};

module.exports = {
    getAll: getAll,
    getByName: getByName,
    create: create,
    nextNamesToRate: nextNamesToRate
};
