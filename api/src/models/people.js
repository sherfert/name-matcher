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
               ORDER BY avgRating DESC, rand()
               LIMIT $limit`,
            {user: user, sexes: sexes, limit: int(limit)})
    ).then(result => result.records.map(r => r.get('name')));
};

// Matches
const matches = function (session, user, otherUser, sexes, skip, limit) {
    return session.readTransaction(txc =>
        txc.run(
            `MATCH (user:Person {name: $user})-[myRating:RATING]->(name:Name)<-[otherRating:RATING]-(otherUser:Person {name: $otherUser})
               WHERE name.sex IN $sexes
             RETURN properties(name) AS name, properties(myRating) as myRating, properties(otherRating) as otherRating
               ORDER BY myRating.stars + otherRating.stars DESC, myRating.stars DESC, name.name
               SKIP $skip 
               LIMIT $limit`,
            {user: user, otherUser: otherUser, sexes: sexes, skip: int(skip), limit: int(limit)})
    ).then(result => result.records.map(r => ({
        name: r.get('name'),
        myRating: r.get('myRating'),
        otherRating: r.get('otherRating'),
    })));
};

// Matches count
const matchesCount = function (session, user, otherUser, sexes) {
    return session.readTransaction(txc =>
        txc.run(
            `MATCH (user:Person {name: $user})-[myRating:RATING]->(name:Name)<-[otherRating:RATING]-(otherUser:Person {name: $otherUser})
               WHERE name.sex IN $sexes
             RETURN count(*) AS count`,
            {user: user, otherUser: otherUser, sexes: sexes})
    ).then(result => result.records[0].get('count'));
};

module.exports = {
    getAll: getAll,
    getByName: getByName,
    create: create,
    nextNamesToRate: nextNamesToRate,
    matches: matches,
    matchesCount: matchesCount,
};
