const Name = require('./neo4j/name');

// get a single name
const get = function (session, name) {
    return session.readTransaction(txc =>
        txc.run('MATCH (name:Name {name: $name}) RETURN name AS name', {name: name})
    ).then(result => result.records.map(r => new Name(r.get('name'))));
};

// get names by prefix
const prefixSearch = function (session, prefix) {
    return session.readTransaction(txc =>
        txc.run('MATCH (name:Name) WHERE name.name STARTS WITH $prefix RETURN name AS name', {prefix: prefix})
    ).then(result => result.records.map(r => new Name(r.get('name'))));
};

// get names by suffix
const suffixSearch = function (session, suffix) {
    return session.readTransaction(txc =>
        txc.run('MATCH (name:Name) WHERE name.name ENDS WITH $suffix RETURN name AS name', {suffix: suffix})
    ).then(result => result.records.map(r => new Name(r.get('name'))));
};

// add a new name
const create = function (session, name, sex) {
    return session.writeTransaction(txc =>
        txc.run('MERGE (name:Name {name: $name}) SET name.sex = $sex RETURN name AS name', {name: name, sex: sex})
    ).then(result => new Name(result.records[0].get('name')));
};

// LOAD CSV
const loadCSV = function (session, filename) {
    const url = `file:///${filename}`;
    return session.writeTransaction(txc =>
        txc.run("LOAD CSV FROM $url AS line MERGE (n:Name {name: line[0]}) ON CREATE SET n.sex = line[1]", {url: url})
    ).then(() => {}); // Query does not return anything
};

module.exports = {
    get: get,
    prefixSearch: prefixSearch,
    suffixSearch: suffixSearch,
    create: create,
    loadCSV: loadCSV
};
