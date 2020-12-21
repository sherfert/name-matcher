const dbUtils = require('../../src/neo4j/dbUtils');
const supertest = require("supertest");
const app = require('../../app');

function init () {
    let server, agent;
    const retVal = {};

    beforeAll(done => {
        server = app.listen( (err) => {
            if (err) return done(err);

            agent = supertest.agent(server);
            retVal.agent = agent;
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
    return retVal;
}

module.exports = init;