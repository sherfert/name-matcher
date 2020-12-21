const supertest = require("supertest");
const nconf = require("../../config");
const apiPath = nconf.get("api_path")
const app = require('../../app');
const dbUtils = require('../../src/neo4j/dbUtils');

let server, agent;

beforeAll(done => {
    server = app.listen(4000, (err) => {
        if (err) return done(err);

        agent = supertest.agent(server);
        done();
    });
});

beforeEach(async done => {
    const session = dbUtils.driver.session();
    await session.writeTransaction(txc =>
        txc.run('MATCH (n) DETACH DELETE n')
    );
    done();
});

afterAll(done => {
    return server && server.close(done);
});

afterEach(async done => {
    const session = dbUtils.driver.session();
    await session.writeTransaction(txc =>
        txc.run('MATCH (n) DETACH DELETE n')
    );
    done();
});


it("Get all people", async done => {
    const response = await agent.get(`${apiPath}/people/`);

    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toStrictEqual([]);

    done();
});

it("Add a single person and get all persons", async done => {
    const name = "TheGuy"
    await agent.post(`${apiPath}/people/${name}`)
    const response = await agent.get(`${apiPath}/people/`);

    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toStrictEqual([{name: name}]);

    done();
});

it("Add a single person and get that person", async done => {
    const name = "TheGuy"
    await agent.post(`${apiPath}/people/${name}`)
    const response = await agent.get(`${apiPath}/people/${name}`);

    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toStrictEqual({name: name});

    done();
});

it("Add the same person twice", async done => {
    const name = "TheGuy"
    await agent.post(`${apiPath}/people/${name}`)
    const response = await agent.post(`${apiPath}/people/${name}`);

    expect(response.status).toBe(400);
    expect(JSON.parse(response.text)).toStrictEqual({"message": "User already exists."});

    done();
});
