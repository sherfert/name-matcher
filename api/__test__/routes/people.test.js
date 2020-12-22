const nconf = require("../../config");
const apiPath = nconf.get("api_path")

const integrationTest = require('./integrationTest');
const given = integrationTest();

it("Add a single person", async done => {
    const name = "TheGuy"
    const response = await given.agent.post(`${apiPath}/people/${name}`);

    expect(JSON.parse(response.text)).toStrictEqual({name: name});
    expect(response.status).toBe(200);

    done();
});

it("Add a single person and get all persons", async done => {
    const name = "TheGuy"
    await given.agent.post(`${apiPath}/people/${name}`);
    const response = await given.agent.get(`${apiPath}/people/`);

    expect(JSON.parse(response.text)).toStrictEqual([{name: name}]);
    expect(response.status).toBe(200);

    done();
});

it("Add a single person and get that person", async done => {
    const name = "TheGuy"
    await given.agent.post(`${apiPath}/people/${name}`);
    const response = await given.agent.get(`${apiPath}/people/${name}`);

    expect(JSON.parse(response.text)).toStrictEqual({name: name});
    expect(response.status).toBe(200);

    done();
});

it("Get a non-existing person", async done => {
    const name = "TheGuy"
    const response = await given.agent.get(`${apiPath}/people/${name}`);

    expect(JSON.parse(response.text)).toStrictEqual({"message": "User not found."});
    expect(response.status).toBe(404);

    done();
});

it("Add the same person twice", async done => {
    const name = "TheGuy"
    await given.agent.post(`${apiPath}/people/${name}`)
    const response = await given.agent.post(`${apiPath}/people/${name}`);

    expect(JSON.parse(response.text)).toStrictEqual({"message": "User already exists."});
    expect(response.status).toBe(400);

    done();
});
