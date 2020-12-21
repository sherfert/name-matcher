const nconf = require("../../config");
const apiPath = nconf.get("api_path")

const integrationTest = require('./integrationTest');
const given = integrationTest();

it("Add a single person", async done => {
    const name = "TheGuy"
    const response = await given.agent.post(`${apiPath}/people/${name}`);

    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toStrictEqual({name: name});

    done();
});

it("Add a single person and get all persons", async done => {
    const name = "TheGuy"
    await given.agent.post(`${apiPath}/people/${name}`);
    const response = await given.agent.get(`${apiPath}/people/`);

    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toStrictEqual([{name: name}]);

    done();
});

it("Add a single person and get that person", async done => {
    const name = "TheGuy"
    await given.agent.post(`${apiPath}/people/${name}`);
    const response = await given.agent.get(`${apiPath}/people/${name}`);

    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toStrictEqual({name: name});

    done();
});

it("Get a non-existing person", async done => {
    const name = "TheGuy"
    const response = await given.agent.get(`${apiPath}/people/${name}`);

    expect(response.status).toBe(404);
    expect(JSON.parse(response.text)).toStrictEqual({"message": "User not found."});

    done();
});

it("Add the same person twice", async done => {
    const name = "TheGuy"
    await given.agent.post(`${apiPath}/people/${name}`)
    const response = await given.agent.post(`${apiPath}/people/${name}`);

    expect(response.status).toBe(400);
    expect(JSON.parse(response.text)).toStrictEqual({"message": "User already exists."});

    done();
});
