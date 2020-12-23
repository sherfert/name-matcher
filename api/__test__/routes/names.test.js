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

it("Suffix search", async done => {
    await given.agent.post(`${apiPath}/names/Jonathan`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Mirian`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Berta`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Radaman`).send({sex: "neutral"});
    await given.agent.post(`${apiPath}/names/Fifian`).send({sex: "girl"});
    const response = await given.agent.get(`${apiPath}/names/an`).query({mode: "suffix", sexes: JSON.stringify({list: ["girl"]})});

    expect(JSON.parse(response.text)).toStrictEqual([{name: "Mirian", sex: "girl"}, {name: "Fifian", sex: "girl"}]);
    expect(response.status).toBe(200);

    done();
});

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
