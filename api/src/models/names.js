
// exact search
const exactSearch = function (session, name) {
    return session.readTransaction(txc =>
        txc.run('MATCH (name:Name {name: $name}) RETURN properties(name) AS name', {name: name})
    ).then(result => result.records.map(r => r.get('name')));
};

// get names by prefix
const prefixSearch = function (session, prefix, sexes) {
    return session.readTransaction(txc =>
        txc.run('MATCH (name:Name) WHERE name.name STARTS WITH $prefix AND name.sex IN $sexes RETURN properties(name) AS name', {prefix: prefix, sexes: sexes})
    ).then(result => result.records.map(r => r.get('name')));
};

// get names by suffix
const suffixSearch = function (session, suffix, sexes) {
    return session.readTransaction(txc =>
        txc.run('MATCH (name:Name) WHERE name.name ENDS WITH $suffix AND name.sex IN $sexes RETURN properties(name) AS name', {suffix: suffix, sexes: sexes})
    ).then(result => result.records.map(r => r.get('name')));
};

// add a new name
const create = function (session, name, sex) {
    return session.writeTransaction(txc =>
        txc.run('MERGE (name:Name {name: $name}) SET name.sex = $sex RETURN properties(name) AS name', {name: name, sex: sex})
    ).then(result => result.records[0].get('name'));
};

// LOAD CSV
const loadCSV = function (session, filename) {
    const url = `file:///${filename}`;
    return session.writeTransaction(txc =>
        txc.run("LOAD CSV FROM $url AS line MERGE (n:Name {name: line[0]}) SET n.sex = line[1]", {url: url})
    ).then(() => {}); // Query does not return anything
};

module.exports = {
    exactSearch: exactSearch,
    prefixSearch: prefixSearch,
    suffixSearch: suffixSearch,
    create: create,
    loadCSV: loadCSV
};
