const nconf = require("../../config");
const apiPath = nconf.get("api_path")

const integrationTest = require('./integrationTest');
const given = integrationTest();

it("Add a single name", async done => {
    const name = "TheGuy"
    const response = await given.agent.post(`${apiPath}/names/${name}`);

    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toStrictEqual({name: name});

    done();
});

it("Add a single name and get that name", async done => {
    const name = "TheGuy"
    await given.agent.post(`${apiPath}/names/${name}`);
    const response = await given.agent.get(`${apiPath}/names/${name}`);

    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toStrictEqual({name: name});

    done();
});

it("Get a non-existing name", async done => {
    const name = "TheGuy"
    const response = await given.agent.get(`${apiPath}/names/${name}`);

    expect(response.status).toBe(404);
    expect(JSON.parse(response.text)).toStrictEqual({"message": "Name not found."});

    done();
});

it("Add the same name twice", async done => {
    const name = "TheGuy"
    await given.agent.post(`${apiPath}/names/${name}`)
    const response = await given.agent.post(`${apiPath}/names/${name}`);

    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toStrictEqual({name: name});

    done();
});
