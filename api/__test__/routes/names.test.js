const nconf = require("../../config");
const apiPath = nconf.get("api_path")

const integrationTest = require('./integrationTest');
const given = integrationTest();

it("Add a single boy name", async done => {
    const name = "TheGuy"
    const sex = "boy"
    const response = await given.agent.post(`${apiPath}/names/${name}`).send({sex: sex});

    expect(JSON.parse(response.text)).toStrictEqual({name: name, sex: sex});
    expect(response.status).toBe(200);

    done();
});

it("Add a single girl name", async done => {
    const name = "TheGirl"
    const sex = "girl"
    const response = await given.agent.post(`${apiPath}/names/${name}`).send({sex: sex});

    expect(JSON.parse(response.text)).toStrictEqual({name: name, sex: sex});
    expect(response.status).toBe(200);

    done();
});

it("Add a single sex-neutral name", async done => {
    const name = "Alex"
    const sex = "neutral"
    const response = await given.agent.post(`${apiPath}/names/${name}`).send({sex: sex});

    expect(JSON.parse(response.text)).toStrictEqual({name: name, sex: sex});
    expect(response.status).toBe(200);

    done();
});

it("Add a single name with invalid sex", async done => {
    const name = "TheCopter"
    const sex = "apache helicopter"
    const response = await given.agent.post(`${apiPath}/names/${name}`).send({sex: sex});

    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sex: ${sex}.`});
    expect(response.status).toBe(400);

    done();
});

it("Add a single name with invalid sex data type", async done => {
    const name = "TheCopter"
    const sex = 5
    const response = await given.agent.post(`${apiPath}/names/${name}`).send({sex: sex});

    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sex: ${sex}.`});
    expect(response.status).toBe(400);

    done();
});

it("Add a single name and get that name", async done => {
    const name = "TheGuy"
    const sex = "boy"
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: sex});
    const response = await given.agent.get(`${apiPath}/names/${name}`);

    expect(JSON.parse(response.text)).toStrictEqual([{name: name, sex: sex}]);
    expect(response.status).toBe(200);

    done();
});

it("Search for a non-existing name", async done => {
    const name = "TheGuy"
    const response = await given.agent.get(`${apiPath}/names/${name}`);

    expect(JSON.parse(response.text)).toStrictEqual([]);
    expect(response.status).toBe(200);

    done();
});

it("Add the same name twice", async done => {
    const name = "TheGuy"
    const sex = "boy"
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: sex});
    const response = await given.agent.post(`${apiPath}/names/${name}`).send({sex: sex});

    expect(JSON.parse(response.text)).toStrictEqual({name: name, sex: sex});
    expect(response.status).toBe(200);

    done();
});

it("Change sex", async done => {
    const name = "Alex"
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: "boy"});
    const response = await given.agent.post(`${apiPath}/names/${name}`).send({sex: "girl"});

    expect(JSON.parse(response.text)).toStrictEqual({name: name, sex: "girl"});
    expect(response.status).toBe(200);

    done();
});

it("Exact search", async done => {
    const name = "Berta"
    await given.agent.post(`${apiPath}/names/Adam`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Berit`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: "girl"});
    const response = await given.agent.get(`${apiPath}/names/${name}`).query({mode: 'exact'});

    expect(JSON.parse(response.text)).toStrictEqual([{name: name, sex: "girl"}]);
    expect(response.status).toBe(200);

    done();
});

it("No mode defaults to exact search", async done => {
    const name = "Berta"
    await given.agent.post(`${apiPath}/names/Adam`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Berit`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/${name}ta`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Ta${name}`).send({sex: "girl"});
    const response = await given.agent.get(`${apiPath}/names/${name}`);

    expect(JSON.parse(response.text)).toStrictEqual([{name: name, sex: "girl"}]);
    expect(response.status).toBe(200);

    done();
});

it("Wrong mode value", async done => {
    const mode = "more-or-less";
    const response = await given.agent.get(`${apiPath}/names/Berta`).query({mode: mode});;

    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid mode: ${mode}.`});
    expect(response.status).toBe(400);

    done();
});

it("Wrong mode type", async done => {
    const mode = 5;
    const response = await given.agent.get(`${apiPath}/names/Berta`).query({mode: mode});

    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid mode: ${mode}.`});
    expect(response.status).toBe(400);

    done();
});

it("Prefix search", async done => {
    await given.agent.post(`${apiPath}/names/Adam`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Berit`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Bert`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Berta`).send({sex: "neutral"});
    const response = await given.agent.get(`${apiPath}/names/B`).query({mode: "prefix", sexes: JSON.stringify({list: ["girl", "neutral"]})});

    expect(JSON.parse(response.text)).toStrictEqual([{name: "Berit", sex: "girl"}, {name: "Berta", sex: "neutral"}]);
    expect(response.status).toBe(200);

    done();
});

it("Wrong prefix search sexes", async done => {
    const sexes = ["helicopter"];
    const response = await given.agent.get(`${apiPath}/names/B`).query({mode: "prefix", sexes: JSON.stringify({list: sexes})});

    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);

    done();
});

it("Wrong prefix search sexes type", async done => {
    const sexes = [5];
    const response = await given.agent.get(`${apiPath}/names/B`).query({mode: "prefix", sexes: JSON.stringify({list: sexes})});

    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);

    done();
});

it("Suffix search", async done => {
    await given.agent.post(`${apiPath}/names/Jonathan`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Mirian`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Berta`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Radaman`).send({sex: "neutral"});
    await given.agent.post(`${apiPath}/names/Fifian`).send({sex: "girl"});
    const response = await given.agent.get(`${apiPath}/names/an`).query({mode: "suffix", sexes: JSON.stringify({list: ["girl"]})});

    const actual = JSON.parse(response.text);
    expect(actual).toStrictEqual([{name: "Mirian", sex: "girl"}, {name: "Fifian", sex: "girl"}]);
    expect(actual).toStrictEqual(expect.arrayContaining([
        {name: "Fifian", sex: "girl"},
        {name: "Mirian", sex: "girl"},
    ]));
    expect(actual.length).toBe(2); // Order undefined for suffix search
    expect(response.status).toBe(200);

    done();
});

it("Wrong suffix search sexes", async done => {
    const sexes = ["helicopter"];
    const response = await given.agent.get(`${apiPath}/names/B`).query({mode: "suffix", sexes: JSON.stringify({list: sexes})});

    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);

    done();
});

it("Wrong suffix search sexes type", async done => {
    const sexes = [5];
    const response = await given.agent.get(`${apiPath}/names/B`).query({mode: "suffix", sexes: JSON.stringify({list: sexes})});

    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);

    done();
});

// TODO put checks into the LOAD CSV query and test that
it("CSV Import", async done => {
    const csvResponse = await given.agent.post(`${apiPath}/names-import`)
        .attach('file',`${__dirname}/files/names.csv`);

    expect(csvResponse.status).toBe(200);

    const names = [
        {name: "Anna", sex: "girl"},
        {name: "Bob", sex: "boy"},
        {name: "Emma", sex: "girl"},
        {name: "Fifi", sex: "boy"},
        {name: "Alex", sex: "neutral"},
    ];

    for (const name of names) {
        const getResponse = await given.agent.get(`${apiPath}/names/${name.name}`).query({mode: 'exact'});
        expect(JSON.parse(getResponse.text)).toStrictEqual([name]);
    }
    done();
});

it("CSV Import overrides sex", async done => {
    await given.agent.post(`${apiPath}/names-import`)
        .attach('file',`${__dirname}/files/names.csv`);
    await given.agent.post(`${apiPath}/names-import`)
        .attach('file',`${__dirname}/files/names2.csv`);

    const names = [
        {name: "Anna", sex: "girl"},
        {name: "Bob", sex: "girl"},
        {name: "Emma", sex: "girl"},
        {name: "Ebba", sex: "girl"},
        {name: "Fifi", sex: "neutral"},
        {name: "Alex", sex: "neutral"},
    ];

    for (const name of names) {
        const getResponse = await given.agent.get(`${apiPath}/names/${name.name}`).query({mode: 'exact'});
        expect(JSON.parse(getResponse.text)).toStrictEqual([name]);
    }
    done();
});

it("Rate a name", async done => {
    const user = "TheGuy"
    const name = "Berta"
    const rating = 5
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: "girl"});

    const response = await given.agent.post(`${apiPath}/names/${name}/rating`).send({user: user, rating: rating});

    expect(JSON.parse(response.text)).toStrictEqual({stars: rating});
    expect(response.status).toBe(200);

    done();
});

it("Rate a name: wrong user type", async done => {
    const user = 5;
    const response = await given.agent.post(`${apiPath}/names/Bert/rating`).send({user: user, rating: 4});

    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid user name: ${user}.`});
    expect(response.status).toBe(400);

    done();
});

it("Rate a name: wrong rating type", async done => {
    const rating = "2";
    const response = await given.agent.post(`${apiPath}/names/Bert/rating`).send({user: "User", rating: rating});

    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid rating: ${rating}.`});
    expect(response.status).toBe(400);

    done();
});

it("Rate a name: wrong rating type float", async done => {
    const rating = 2.2;
    const response = await given.agent.post(`${apiPath}/names/Bert/rating`).send({user: "User", rating: rating});

    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid rating: ${rating}.`});
    expect(response.status).toBe(400);

    done();
});

it("Rate a name and exact search", async done => {
    const user = "TheGuy"
    const name = "Berta"
    const rating = 5
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/${name}/rating`).send({user: user, rating: rating});

    const response = await given.agent.get(`${apiPath}/names/${name}/rating`).query({user: user, mode: "exact"});

    expect(JSON.parse(response.text)).toStrictEqual([{name: {name: name, sex: "girl"}, rating: {stars: rating}}]);
    expect(response.status).toBe(200);

    done();
});

it("Rate a name twice overrides rating", async done => {
    const user = "TheGuy"
    const name = "Berta"
    const rating = 5
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/${name}/rating`).send({user: user, rating: 2});
    await given.agent.post(`${apiPath}/names/${name}/rating`).send({user: user, rating: rating});

    const response = await given.agent.get(`${apiPath}/names/${name}/rating`).query({user: user, mode: "exact"});

    expect(JSON.parse(response.text)).toStrictEqual([{name: {name: name, sex: "girl"}, rating: {stars: rating}}]);
    expect(response.status).toBe(200);

    done();
});

it("Prefix search with rating", async done => {
    const user = "TheGuy"
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/names/Adam`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Berit`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Berit/rating`).send({user: user, rating: 3});
    await given.agent.post(`${apiPath}/names/Bert`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Berta`).send({sex: "neutral"});


    const response = await given.agent.get(`${apiPath}/names/B/rating`).query({user: user, mode: "prefix", sexes: JSON.stringify({list: ["girl", "neutral"]})});

    expect(JSON.parse(response.text)).toStrictEqual([
        {name: {name: "Berit", sex: "girl"}, rating: {stars: 3}},
        {name: {name: "Berta", sex: "neutral"}, rating: null},
    ]);
    expect(response.status).toBe(200);

    done();
});

it("Suffix search with rating", async done => {
    const user = "TheGuy"
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/names/Jonathan`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Mirian`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Berta`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Radaman`).send({sex: "neutral"});
    await given.agent.post(`${apiPath}/names/Fifian`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Fifian/rating`).send({user: user, rating: 5});


    const response = await given.agent.get(`${apiPath}/names/an/rating`).query({user: user, mode: "suffix", sexes: JSON.stringify({list: ["girl"]})});

    const actual = JSON.parse(response.text);
    expect(actual).toStrictEqual(expect.arrayContaining([
        {name: {name: "Fifian", sex: "girl"}, rating: {stars: 5}},
        {name: {name: "Mirian", sex: "girl"}, rating: null},
    ]));
    expect(actual.length).toBe(2); // Order undefined for suffix search
    expect(response.status).toBe(200);

    done();
});

it("No mode defaults to exact search with rating", async done => {
    const user = "TheGuy"
    const name = "Berta"
    const rating = 5
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/${name}ta`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Ta${name}`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/${name}/rating`).send({user: user, rating: rating});

    const response = await given.agent.get(`${apiPath}/names/${name}/rating`).query({user: user});

    expect(JSON.parse(response.text)).toStrictEqual([{name: {name: name, sex: "girl"}, rating: {stars: rating}}]);
    expect(response.status).toBe(200);

    done();
});

it("Search with rating: wrong mode value", async done => {
    const mode = "more-or-less";
    const response = await given.agent.get(`${apiPath}/names/Berta/rating`).query({mode: mode, user: "User"});;

    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid mode: ${mode}.`});
    expect(response.status).toBe(400);

    done();
});

it("Search with rating: wrong mode type", async done => {
    const mode = 5;
    const response = await given.agent.get(`${apiPath}/names/Berta/rating`).query({mode: mode, user: "User"});;

    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid mode: ${mode}.`});
    expect(response.status).toBe(400);

    done();
});

it("Wrong prefix search sexes with rating", async done => {
    const sexes = ["helicopter"];
    const response = await given.agent.get(`${apiPath}/names/B/rating`).query({mode: "prefix", user: "User", sexes: JSON.stringify({list: sexes})});

    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);

    done();
});

it("Wrong prefix search sexes type with rating", async done => {
    const sexes = [5];
    const response = await given.agent.get(`${apiPath}/names/B/rating`).query({mode: "prefix", user: "User", sexes: JSON.stringify({list: sexes})});

    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);

    done();
});

it("Wrong suffix search sexes with rating", async done => {
    const sexes = ["helicopter"];
    const response = await given.agent.get(`${apiPath}/names/B/rating`).query({mode: "suffix", user: "User", sexes: JSON.stringify({list: sexes})});

    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);

    done();
});

it("Wrong suffix search sexes type with rating", async done => {
    const sexes = [5];
    const response = await given.agent.get(`${apiPath}/names/B/rating`).query({mode: "suffix", user: "User", sexes: JSON.stringify({list: sexes})});

    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);

    done();
});