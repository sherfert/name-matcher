const nconf = require("../../config");
const apiPath = nconf.get("api_path")

const integrationTest = require('./integrationTest');
const given = integrationTest();

it("Add a single boy name", async done => {
    // GIVEN
    const name = "TheGuy";
    const sex = "boy"

    // WHEN
    const response = await given.agent.post(`${apiPath}/names/${name}`).send({sex: sex});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({name: name, sex: sex});
    expect(response.status).toBe(200);
    done();
});

it("Add a single girl name", async done => {
    // GIVEN
    const name = "TheGirl";
    const sex = "girl";

    // WHEN
    const response = await given.agent.post(`${apiPath}/names/${name}`).send({sex: sex});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({name: name, sex: sex});
    expect(response.status).toBe(200);
    done();
});

it("Add a single sex-neutral name", async done => {
    // GIVEN
    const name = "Alex";
    const sex = "neutral";

    // WHEN
    const response = await given.agent.post(`${apiPath}/names/${name}`).send({sex: sex});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({name: name, sex: sex});
    expect(response.status).toBe(200);
    done();
});

it("Add a single name with invalid sex", async done => {
    // GIVEN
    const name = "TheCopter";
    const sex = "apache helicopter";

    // WHEN
    const response = await given.agent.post(`${apiPath}/names/${name}`).send({sex: sex});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sex: ${sex}.`});
    expect(response.status).toBe(400);
    done();
});

it("Add a single name with invalid sex data type", async done => {
    // GIVEN
    const name = "TheCopter";
    const sex = 5;

    // WHEN
    const response = await given.agent.post(`${apiPath}/names/${name}`).send({sex: sex});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sex: ${sex}.`});
    expect(response.status).toBe(400);
    done();
});

it("Add a single name and get that name", async done => {
    // GIVEN
    const name = "TheGuy";
    const sex = "boy";
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: sex});

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/${name}`);

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual([{name: name, sex: sex}]);
    expect(response.status).toBe(200);
    done();
});

it("Search for a non-existing name", async done => {
    // GIVEN
    const name = "TheGuy";

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/${name}`);

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual([]);
    expect(response.status).toBe(200);
    done();
});

it("Add the same name twice", async done => {
    // GIVEN
    const name = "TheGuy";
    const sex = "boy";
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: sex});

    // WHEN
    const response = await given.agent.post(`${apiPath}/names/${name}`).send({sex: sex});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({name: name, sex: sex});
    expect(response.status).toBe(200);
    done();
});

it("Change sex", async done => {
    // GIVEN
    const name = "Alex";
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: "boy"});

    // WHEN
    const response = await given.agent.post(`${apiPath}/names/${name}`).send({sex: "girl"});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({name: name, sex: "girl"});
    expect(response.status).toBe(200);
    done();
});

it("Exact search", async done => {
    // GIVEN
    const name = "Berta";
    await given.agent.post(`${apiPath}/names/Adam`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Berit`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: "girl"});

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/${name}`).query({mode: 'exact'});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual([{name: name, sex: "girl"}]);
    expect(response.status).toBe(200);
    done();
});

it("No mode defaults to exact search", async done => {
    // GIVEN
    const name = "Berta";
    await given.agent.post(`${apiPath}/names/Adam`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Berit`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/${name}ta`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Ta${name}`).send({sex: "girl"});

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/${name}`);

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual([{name: name, sex: "girl"}]);
    expect(response.status).toBe(200);
    done();
});

it("Wrong mode value", async done => {
    // GIVEN
    const mode = "more-or-less";

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/Berta`).query({mode: mode});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid mode: ${mode}.`});
    expect(response.status).toBe(400);
    done();
});

it("Wrong mode type", async done => {
    // GIVEN
    const mode = 5;

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/Berta`).query({mode: mode});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid mode: ${mode}.`});
    expect(response.status).toBe(400);
    done();
});

it("Prefix search", async done => {
    // GIVEN
    await given.agent.post(`${apiPath}/names/Adam`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Berit`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Bert`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Berta`).send({sex: "neutral"});

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/B`).query({mode: "prefix", sexes: JSON.stringify({list: ["girl", "neutral"]})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual([{name: "Berit", sex: "girl"}, {name: "Berta", sex: "neutral"}]);
    expect(response.status).toBe(200);
    done();
});

it("Wrong prefix search sexes", async done => {
    // GIVEN
    const sexes = ["helicopter"];

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/B`).query({mode: "prefix", sexes: JSON.stringify({list: sexes})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);
    done();
});

it("Wrong prefix search sexes type", async done => {
    // GIVEN
    const sexes = [5];

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/B`).query({mode: "prefix", sexes: JSON.stringify({list: sexes})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);
    done();
});

it("Suffix search", async done => {
    // GIVEN
    await given.agent.post(`${apiPath}/names/Jonathan`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Mirian`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Berta`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Radaman`).send({sex: "neutral"});
    await given.agent.post(`${apiPath}/names/Fifian`).send({sex: "girl"});

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/an`).query({mode: "suffix", sexes: JSON.stringify({list: ["girl"]})});

    // THEN
    const actual = JSON.parse(response.text);
    expect(actual).toStrictEqual(expect.arrayContaining([
        {name: "Fifian", sex: "girl"},
        {name: "Mirian", sex: "girl"},
    ]));
    expect(actual.length).toBe(2); // Order undefined for suffix search
    expect(response.status).toBe(200);
    done();
});

it("Wrong suffix search sexes", async done => {
    // GIVEN
    const sexes = ["helicopter"];

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/B`).query({mode: "suffix", sexes: JSON.stringify({list: sexes})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);
    done();
});

it("Wrong suffix search sexes type", async done => {
    // GIVEN
    const sexes = [5];

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/B`).query({mode: "suffix", sexes: JSON.stringify({list: sexes})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);
    done();
});

it("Contains search", async done => {
    // GIVEN
    await given.agent.post(`${apiPath}/names/Jonathan`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Mirian`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Berta`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Radaman`).send({sex: "neutral"});
    await given.agent.post(`${apiPath}/names/Fifian`).send({sex: "girl"});

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/i`).query({mode: "contains", sexes: JSON.stringify({list: ["girl"]})});

    // THEN
    const actual = JSON.parse(response.text);
    expect(actual).toStrictEqual(expect.arrayContaining([
        {name: "Fifian", sex: "girl"},
        {name: "Mirian", sex: "girl"},
    ]));
    expect(actual.length).toBe(2); // Order undefined for contains search
    expect(response.status).toBe(200);
    done();
});

it("Wrong contains search sexes", async done => {
    // GIVEN
    const sexes = ["helicopter"];

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/B`).query({mode: "contains", sexes: JSON.stringify({list: sexes})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);
    done();
});

it("Wrong contains search sexes type", async done => {
    // GIVEN
    const sexes = [5];

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/B`).query({mode: "contains", sexes: JSON.stringify({list: sexes})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);
    done();
});

it("CSV Import", async done => {
    // GIVEN
    const csvResponse = await given.agent.post(`${apiPath}/names-import`)
        .attach('file', `${__dirname}/files/names.csv`);

    expect(csvResponse.status).toBe(200);

    const names = [
        {name: "Anna", sex: "girl"},
        {name: "Bob", sex: "boy"},
        {name: "Emma", sex: "girl"},
        {name: "Fifi", sex: "boy"},
        {name: "Alex", sex: "neutral"},
    ];

    for (const name of names) {
        // WHEN
        const getResponse = await given.agent.get(`${apiPath}/names/${name.name}`).query({mode: 'exact'});

        // THEN
        expect(JSON.parse(getResponse.text)).toStrictEqual([name]);
    }
    done();
});

it("CSV Import overrides sex", async done => {
    // GIVEN
    await given.agent.post(`${apiPath}/names-import`)
        .attach('file', `${__dirname}/files/names.csv`);
    await given.agent.post(`${apiPath}/names-import`)
        .attach('file', `${__dirname}/files/names2.csv`);

    const names = [
        {name: "Anna", sex: "girl"},
        {name: "Bob", sex: "girl"},
        {name: "Emma", sex: "girl"},
        {name: "Ebba", sex: "girl"},
        {name: "Fifi", sex: "neutral"},
        {name: "Alex", sex: "neutral"},
    ];

    for (const name of names) {
        // WHEN
        const getResponse = await given.agent.get(`${apiPath}/names/${name.name}`).query({mode: 'exact'});

        // THEN
        expect(JSON.parse(getResponse.text)).toStrictEqual([name]);
    }
    done();
});

it("Rate a name", async done => {
    // GIVEN
    const user = "TheGuy"
    const name = "Berta"
    const rating = 5
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: "girl"});


    // WHEN
    const response = await given.agent.post(`${apiPath}/names/${name}/rating`).send({user: user, rating: rating});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({stars: rating});
    expect(response.status).toBe(200);
    done();
});

it("Rate a name: wrong user type", async done => {
    // GIVEN
    const user = 5;

    // WHEN
    const response = await given.agent.post(`${apiPath}/names/Bert/rating`).send({user: user, rating: 4});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid user name: ${user}.`});
    expect(response.status).toBe(400);
    done();
});

it("Rate a name: wrong rating type", async done => {
    // GIVEN
    const rating = "2";

    // WHEN
    const response = await given.agent.post(`${apiPath}/names/Bert/rating`).send({user: "User", rating: rating});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid rating: ${rating}.`});
    expect(response.status).toBe(400);
    done();
});

it("Rate a name: wrong rating type float", async done => {
    // GIVEN
    const rating = 2.2;

    // WHEN
    const response = await given.agent.post(`${apiPath}/names/Bert/rating`).send({user: "User", rating: rating});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid rating: ${rating}.`});
    expect(response.status).toBe(400);
    done();
});

it("Rate a name and exact search", async done => {
    // GIVEN
    const user = "TheGuy"
    const name = "Berta"
    const rating = 5
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/${name}/rating`).send({user: user, rating: rating});

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/${name}/rating`).query({user: user, mode: "exact"});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual([{name: {name: name, sex: "girl"}, rating: {stars: rating}}]);
    expect(response.status).toBe(200);
    done();
});

it("Rate a name twice overrides rating", async done => {
    // GIVEN
    const user = "TheGuy"
    const name = "Berta"
    const rating = 5
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/${name}/rating`).send({user: user, rating: 2});
    await given.agent.post(`${apiPath}/names/${name}/rating`).send({user: user, rating: rating});


    // WHEN
    const response = await given.agent.get(`${apiPath}/names/${name}/rating`).query({user: user, mode: "exact"});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual([{name: {name: name, sex: "girl"}, rating: {stars: rating}}]);
    expect(response.status).toBe(200);
    done();
});

it("Prefix search with rating", async done => {
    // GIVEN
    const user = "TheGuy"
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/names/Adam`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Berit`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Berit/rating`).send({user: user, rating: 3});
    await given.agent.post(`${apiPath}/names/Bert`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Berta`).send({sex: "neutral"});

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/B/rating`).query({user: user, mode: "prefix", sexes: JSON.stringify({list: ["girl", "neutral"]})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual([
        {name: {name: "Berit", sex: "girl"}, rating: {stars: 3}},
        {name: {name: "Berta", sex: "neutral"}, rating: null},
    ]);
    expect(response.status).toBe(200);
    done();
});

it("Suffix search with rating", async done => {
    // GIVEN
    const user = "TheGuy"
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/names/Jonathan`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Mirian`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Berta`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Radaman`).send({sex: "neutral"});
    await given.agent.post(`${apiPath}/names/Fifian`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Fifian/rating`).send({user: user, rating: 5});

    // WHEN
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

it("Contains search with rating", async done => {
    // GIVEN
    const user = "TheGuy"
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/names/Jonathan`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Mirian`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Berta`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Radaman`).send({sex: "neutral"});
    await given.agent.post(`${apiPath}/names/Fifian`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Fifian/rating`).send({user: user, rating: 5});

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/i/rating`).query({user: user, mode: "contains", sexes: JSON.stringify({list: ["girl"]})});

    const actual = JSON.parse(response.text);
    expect(actual).toStrictEqual(expect.arrayContaining([
        {name: {name: "Fifian", sex: "girl"}, rating: {stars: 5}},
        {name: {name: "Mirian", sex: "girl"}, rating: null},
    ]));
    expect(actual.length).toBe(2); // Order undefined for contains search
    expect(response.status).toBe(200);
    done();
});

it("No mode defaults to exact search with rating", async done => {
    // GIVEN
    const user = "TheGuy"
    const name = "Berta"
    const rating = 5
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/names/${name}`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/${name}ta`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Ta${name}`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/${name}/rating`).send({user: user, rating: rating});

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/${name}/rating`).query({user: user});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual([{name: {name: name, sex: "girl"}, rating: {stars: rating}}]);
    expect(response.status).toBe(200);
    done();
});

it("Search with rating: wrong mode value", async done => {
    // GIVEN
    const mode = "more-or-less";

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/Berta/rating`).query({mode: mode, user: "User"});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid mode: ${mode}.`});
    expect(response.status).toBe(400);
    done();
});

it("Search with rating: wrong mode type", async done => {
    // GIVEN
    const mode = 5;

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/Berta/rating`).query({mode: mode, user: "User"});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid mode: ${mode}.`});
    expect(response.status).toBe(400);
    done();
});

it("Wrong prefix search sexes with rating", async done => {
    // GIVEN
    const sexes = ["helicopter"];

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/B/rating`).query({mode: "prefix", user: "User", sexes: JSON.stringify({list: sexes})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);
    done();
});

it("Wrong prefix search sexes type with rating", async done => {
    // GIVEN
    const sexes = [5];

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/B/rating`).query({mode: "prefix", user: "User", sexes: JSON.stringify({list: sexes})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);
    done();
});

it("Wrong suffix search sexes with rating", async done => {
    // GIVEN
    const sexes = ["helicopter"];

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/B/rating`).query({mode: "suffix", user: "User", sexes: JSON.stringify({list: sexes})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);
    done();
});

it("Wrong suffix search sexes type with rating", async done => {
    // GIVEN
    const sexes = [5];

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/B/rating`).query({mode: "suffix", user: "User", sexes: JSON.stringify({list: sexes})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);
    done();
});

it("Wrong contains search sexes with rating", async done => {
    // GIVEN
    const sexes = ["helicopter"];

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/B/rating`).query({mode: "contains", user: "User", sexes: JSON.stringify({list: sexes})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);
    done();
});

it("Wrong contains search sexes type with rating", async done => {
    // GIVEN
    const sexes = [5];

    // WHEN
    const response = await given.agent.get(`${apiPath}/names/B/rating`).query({mode: "contains", user: "User", sexes: JSON.stringify({list: sexes})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": `Invalid sexes: ${sexes}.`});
    expect(response.status).toBe(400);
    done();
});