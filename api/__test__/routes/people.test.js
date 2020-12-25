const nconf = require("../../config");
const apiPath = nconf.get("api_path")

const integrationTest = require('./integrationTest');
const given = integrationTest();

it("Add a single person", async done => {
    // GIVEN
    const name = "TheGuy"

    // WHEN
    const response = await given.agent.post(`${apiPath}/people/${name}`);

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({name: name});
    expect(response.status).toBe(200);
    done();
});

it("Add a single person and get all persons", async done => {
    // GIVEN
    const name = "TheGuy"
    await given.agent.post(`${apiPath}/people/${name}`);

    // WHEN
    const response = await given.agent.get(`${apiPath}/people/`);

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual([{name: name}]);
    expect(response.status).toBe(200);
    done();
});

it("Add a single person and get that person", async done => {
    // GIVEN
    const name = "TheGuy"
    await given.agent.post(`${apiPath}/people/${name}`);

    // WHEN
    const response = await given.agent.get(`${apiPath}/people/${name}`);

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({name: name});
    expect(response.status).toBe(200);
    done();
});

it("Get a non-existing person", async done => {
    // GIVEN
    const name = "TheGuy"

    // WHEN
    const response = await given.agent.get(`${apiPath}/people/${name}`);

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": "User not found."});
    expect(response.status).toBe(404);
    done();
});

it("Add the same person twice", async done => {
    // GIVEN
    const name = "TheGuy"
    await given.agent.post(`${apiPath}/people/${name}`)

    // WHEN
    const response = await given.agent.post(`${apiPath}/people/${name}`);

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual({"message": "User already exists."});
    expect(response.status).toBe(400);
    done();
});

it("names-to-rate: No names in database.", async done => {
    // GIVEN
    const user = "TheGuy"
    await given.agent.post(`${apiPath}/people/${user}`);

    // WHEN
    const response = await given.agent.get(`${apiPath}/people/${user}/names-to-rate`).query({sexes: JSON.stringify({list: ["girl"]})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual([]);
    expect(response.status).toBe(200);
    done();
});

it("names-to-rate: Only unrated names in database.", async done => {
    // GIVEN
    const user = "TheGuy"
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/names/Bert`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Berta`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Bebb`).send({sex: "neutral"});

    // WHEN
    const response = await given.agent.get(`${apiPath}/people/${user}/names-to-rate`).query({sexes: JSON.stringify({list: ["girl", "neutral"]})});

    const actual = JSON.parse(response.text);
    expect(actual).toStrictEqual(expect.arrayContaining([
        {name: "Bebb", sex: "neutral"},
        {name: "Berta", sex: "girl"}
    ]));
    expect(actual.length).toBe(2); // Order undefined
    expect(response.status).toBe(200);
    done();
});

it("names-to-rate: Only rated names in database.", async done => {
    // GIVEN
    const user = "TheGuy"
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/names/Bert`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Bert/rating`).send({user: user, rating: 1});
    await given.agent.post(`${apiPath}/names/Berta`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Berta/rating`).send({user: user, rating: 2});
    await given.agent.post(`${apiPath}/names/Bebb`).send({sex: "neutral"});
    await given.agent.post(`${apiPath}/names/Bebb/rating`).send({user: user, rating: 3});

    // WHEN
    const response = await given.agent.get(`${apiPath}/people/${user}/names-to-rate`).query({sexes: JSON.stringify({list: ["girl", "neutral"]})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual([]);
    expect(response.status).toBe(200);
    done();
});

it("names-to-rate: Empty sexes list.", async done => {
    // GIVEN
    const user = "TheGuy"
    await given.agent.post(`${apiPath}/people/${user}`);

    // WHEN
    const response = await given.agent.get(`${apiPath}/people/${user}/names-to-rate`).query({sexes: JSON.stringify({list: []})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual([]);
    expect(response.status).toBe(200);
    done();
});

it("names-to-rate: Names rated by one other user in database.", async done => {
    // GIVEN
    const user = "TheGuy"
    const otherUser = "TheGirl"
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/people/${otherUser}`);

    // Rated only by user
    await given.agent.post(`${apiPath}/names/Bert`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Bert/rating`).send({user: user, rating: 1});

    // Rated only by other user
    await given.agent.post(`${apiPath}/names/Berta`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Berta/rating`).send({user: otherUser, rating: 4});
    await given.agent.post(`${apiPath}/names/Zulu`).send({sex: "neutral"});
    await given.agent.post(`${apiPath}/names/Zulu/rating`).send({user: otherUser, rating: 1});
    await given.agent.post(`${apiPath}/names/Famiko`).send({sex: "neutral"});
    await given.agent.post(`${apiPath}/names/Famiko/rating`).send({user: otherUser, rating: 2});
    await given.agent.post(`${apiPath}/names/Jojo`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Jojo/rating`).send({user: otherUser, rating: 5});

    // Rated by both
    await given.agent.post(`${apiPath}/names/Bebb`).send({sex: "neutral"});
    await given.agent.post(`${apiPath}/names/Bebb/rating`).send({user: user, rating: 3});
    await given.agent.post(`${apiPath}/names/Bebb/rating`).send({user: otherUser, rating: 2});

    // Not rated by anyone
    await given.agent.post(`${apiPath}/names/Nomo`).send({sex: "neutral"});

    // WHEN
    const response = await given.agent.get(`${apiPath}/people/${user}/names-to-rate`).query({sexes: JSON.stringify({list: ["boy", "girl", "neutral"]})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual([
        {name: "Jojo", sex: "boy"}, // Rated 5
        {name: "Berta", sex: "girl"}, // Rated 4
        {name: "Nomo", sex: "neutral"}, // Not rated
        {name: "Famiko", sex: "neutral"}, // Rated 2
        {name: "Zulu", sex: "neutral"}, // Rated 1
    ]);
    expect(response.status).toBe(200);
    done();
});

it("names-to-rate: Limits results", async done => {
    // GIVEN
    const user = "TheGuy"
    const otherUser = "TheGirl"
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/people/${otherUser}`);

    // Rated only by other user
    await given.agent.post(`${apiPath}/names/Berta`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Bert/rating`).send({user: otherUser, rating: 4});
    await given.agent.post(`${apiPath}/names/Zulu`).send({sex: "neutral"});
    await given.agent.post(`${apiPath}/names/Zulu/rating`).send({user: otherUser, rating: 1});
    await given.agent.post(`${apiPath}/names/Famiko`).send({sex: "neutral"});
    await given.agent.post(`${apiPath}/names/Famiko/rating`).send({user: otherUser, rating: 2});
    await given.agent.post(`${apiPath}/names/Jojo`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Jojo/rating`).send({user: otherUser, rating: 5});

    // WHEN
    const response = await given.agent.get(`${apiPath}/people/${user}/names-to-rate`).query({limit: 2, sexes: JSON.stringify({list: ["girl", "neutral", "boy"]})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual([
        {name: "Jojo", sex: "boy"}, // Rated 5
        {name: "Berta", sex: "girl"}, // Rated 4
    ]);
    expect(response.status).toBe(200);
    done();
});

it("names-to-rate: Names rated by two other users in database.", async done => {
    // GIVEN
    const user = "TheGuy"
    const otherUser1 = "TheGirl"
    const otherUser2 = "TheBeing"
    await given.agent.post(`${apiPath}/people/${user}`);
    await given.agent.post(`${apiPath}/people/${otherUser1}`);
    await given.agent.post(`${apiPath}/people/${otherUser2}`);

    // Rated only by other users
    await given.agent.post(`${apiPath}/names/Berta`).send({sex: "girl"});
    await given.agent.post(`${apiPath}/names/Berta/rating`).send({user: otherUser1, rating: 4});
    await given.agent.post(`${apiPath}/names/Berta/rating`).send({user: otherUser2, rating: 1});
    await given.agent.post(`${apiPath}/names/Zulu`).send({sex: "neutral"});
    await given.agent.post(`${apiPath}/names/Zulu/rating`).send({user: otherUser1, rating: 1});
    await given.agent.post(`${apiPath}/names/Zulu/rating`).send({user: otherUser2, rating: 3});
    await given.agent.post(`${apiPath}/names/Famiko`).send({sex: "neutral"});
    await given.agent.post(`${apiPath}/names/Famiko/rating`).send({user: otherUser1, rating: 2});
    await given.agent.post(`${apiPath}/names/Famiko/rating`).send({user: otherUser2, rating: 5});
    await given.agent.post(`${apiPath}/names/Jojo`).send({sex: "boy"});
    await given.agent.post(`${apiPath}/names/Jojo/rating`).send({user: otherUser1, rating: 5});
    await given.agent.post(`${apiPath}/names/Jojo/rating`).send({user: otherUser2, rating: 4});

    // Not rated by anyone
    await given.agent.post(`${apiPath}/names/Nomo`).send({sex: "neutral"});

    // WHEN
    const response = await given.agent.get(`${apiPath}/people/${user}/names-to-rate`).query({sexes: JSON.stringify({list: ["boy", "girl", "neutral"]})});

    // THEN
    expect(JSON.parse(response.text)).toStrictEqual([
        {name: "Jojo", sex: "boy"}, // Rated 4.5
        {name: "Famiko", sex: "neutral"}, // Rated 3.5
        {name: "Nomo", sex: "neutral"}, // Not rated
        {name: "Berta", sex: "girl"}, // Rated 2.5
        {name: "Zulu", sex: "neutral"}, // Rated 2
    ]);
    expect(response.status).toBe(200);
    done();
});