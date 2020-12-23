
// exact search
const exactSearch = function (session, name) {
    return session.readTransaction(txc =>
        txc.run(
            `MATCH (name:Name {name: $name}) 
             RETURN properties(name) AS name`,
            {name: name})
    ).then(result => result.records.map(r => r.get('name')));
};

// get names by prefix
const prefixSearch = function (session, prefix, sexes) {
    return session.readTransaction(txc =>
        txc.run(
            `MATCH (name:Name) 
               WHERE name.name STARTS WITH $prefix AND name.sex IN $sexes 
             RETURN properties(name) AS name`,
            {prefix: prefix, sexes: sexes})
    ).then(result => result.records.map(r => r.get('name')));
};

// get names by suffix
const suffixSearch = function (session, suffix, sexes) {
    return session.readTransaction(txc =>
        txc.run(
            `MATCH (name:Name) 
               WHERE name.name ENDS WITH $suffix AND name.sex IN $sexes 
             RETURN properties(name) AS name`,
            {suffix: suffix, sexes: sexes})
    ).then(result => result.records.map(r => r.get('name')));
};

// exact search with rating
const exactSearchWithRating = function (session, user,  name) {
    return session.readTransaction(txc =>
        txc.run(
            `MATCH (user:Person {name: $user}), (name:Name {name: $name}) 
             OPTIONAL MATCH (user)-[rating:RATING]->(name) 
             RETURN properties(name) AS name, properties(rating) as rating`,
            {name: name, user: user})
    ).then(result => result.records.map(r => ({
        name: r.get('name'),
        rating: r.get('rating')
    })));
};

// prefix search with rating
const prefixSearchWithRating = function (session, user, prefix, sexes) {
    return session.readTransaction(txc =>
        txc.run(
            `MATCH (user:Person {name: $user}), (name:Name)
               WHERE name.name STARTS WITH $prefix AND name.sex IN $sexes 
             OPTIONAL MATCH (user)-[rating:RATING]->(name) 
             RETURN properties(name) AS name, properties(rating) as rating`,
            {prefix: prefix, sexes: sexes, user: user})
    ).then(result => result.records.map(r => ({
        name: r.get('name'),
        rating: r.get('rating')
    })));
};

// suffix search with rating
const suffixSearchWithRating = function (session, user, suffix, sexes) {
    return session.readTransaction(txc =>
        txc.run(
            `MATCH (user:Person {name: $user}), (name:Name)
               WHERE name.name ENDS WITH $suffix AND name.sex IN $sexes 
             OPTIONAL MATCH (user)-[rating:RATING]->(name) 
             RETURN properties(name) AS name, properties(rating) as rating`,
            {suffix: suffix, sexes: sexes, user: user})
    ).then(result => result.records.map(r => ({
        name: r.get('name'),
        rating: r.get('rating')
    })));
};

// add a new name
const create = function (session, name, sex) {
    return session.writeTransaction(txc =>
        txc.run(
            `MERGE (name:Name {name: $name}) 
             SET name.sex = $sex 
             RETURN properties(name) AS name`,
            {name: name, sex: sex})
    ).then(result => result.records[0].get('name'));
};

// LOAD CSV
const loadCSV = function (session, filename) {
    const url = `file:///${filename}`;
    return session.writeTransaction(txc =>
        txc.run(
            `LOAD CSV FROM $url AS line 
             MERGE (n:Name {name: line[0]}) 
             SET n.sex = line[1]`,
            {url: url})
    ).then(() => {}); // Query does not return anything
};

// Rate a name
const rate = function(session, user, name, rating) {
    return session.writeTransaction(txc =>
        txc.run(
            `MATCH (user:Person {name: $user}), (name:Name {name: $name}) 
             MERGE (user)-[rating:RATING]->(name) 
             SET rating.stars = toInteger($rating) 
             RETURN properties(rating) AS rating`,
            {user: user, name: name, rating: rating})
    ).then(result => result.records[0].get('rating'));
}

module.exports = {
    exactSearch: exactSearch,
    prefixSearch: prefixSearch,
    suffixSearch: suffixSearch,
    exactSearchWithRating: exactSearchWithRating,
    prefixSearchWithRating: prefixSearchWithRating,
    suffixSearchWithRating: suffixSearchWithRating,
    create: create,
    loadCSV: loadCSV,
    rate: rate
};
