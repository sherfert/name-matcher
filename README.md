# name-matcher
Try to find a name for your kid using a Tinder like interface where both parents can rate names.

## Development setup

* Host a `neo4j 4.2 enterprise` database. You can download neo4j in their [download center](https://neo4j.com/download-center/) or use a [hosted cloud instance](https://neo4j.com/cloud/aura/).
* Edit `api/.env` so that username, password and URL matches your running instance.
* Run the backend.
  * `cd api`
  * `nvm use`
  * `npm install`
  * `npm start`
* Run the frontend.
  * `cd client`
  * `nvm use`
  * `npm install`
  * `npm start`
* The website can now be reached: http://localhost:3000/

## Tests

* Run server integration test with:
  * Start neo4j, same as above.
  * `cd api`
  * `npm test`