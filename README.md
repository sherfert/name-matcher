# name-matcher
Try to find a name for your kid using a Tinder like interface where both parents can rate names.

## Development setup

* Host a `neo4j 4.2 enterprise` database. You can download neo4j in their [download center](https://neo4j.com/download-center/) or use a [hosted cloud instance](https://neo4j.com/cloud/aura/).
* Edit `api/.env` so that username, password and URL matches your running instance.
  The `DATABASE_IMPORT_PATH` variable needs to point to the import folder of your neo4j instance.
  This does not work with non-local neo4j instances.
  The path can either be absolute of relative from the `api` folder.
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

For convenience, you can also run `./run-dev.sh`. 
This requires that a neo4j database can be found in the `neo4j` folder. 

## Tests

* Run server integration test with:
  * Start neo4j, same as above.
  * `cd api`
  * `npm test`