"use strict";

const dbUtils = require('./dbUtils');

exports.createDBConstraints = function() {
  const session = dbUtils.driver.session();
  session.writeTransaction(txc => {
    txc.run("CREATE CONSTRAINT person_name IF NOT EXISTS ON (p:Person) ASSERT (p.name) IS NODE KEY");
    txc.run("CREATE CONSTRAINT name_name IF NOT EXISTS ON (n:Name) ASSERT (n.name) IS NODE KEY");
  }).catch(err => console.log(err));
}