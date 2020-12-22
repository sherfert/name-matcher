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

    expect(JSON.parse(response.text)).toStrictEqual({name: name, sex: sex});
    expect(response.status).toBe(200);

    done();
});

it("Get a non-existing name", async done => {
    const name = "TheGuy"
    const response = await given.agent.get(`${apiPath}/names/${name}`);

    expect(JSON.parse(response.text)).toStrictEqual({"message": "Name not found."});
    expect(response.status).toBe(404);

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
