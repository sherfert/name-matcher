# name-matcher
Try to find a name for your kid using a Tinder like interface where both parents can rate names.

# Setup

* Host a `neo4j 4.2` database. 
  Edit `api/.env` so that username, password and URL matches your running instance.
* Run the backend.
  * `cd api`
  * `nvm use`
  * `npm install`
  * `node app.js` starts the API