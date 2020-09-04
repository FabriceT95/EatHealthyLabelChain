/*
Code needed to start the server related to the project
 */

const { program } = require('commander');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const events = require('./events');

// Getting parameters from command line : all parameters are needed to start the mysql server
// For security, params are asked to the user
program
  .option('-u, --user <user>', 'user chosen')
  .option('-pwd, --password <password>', 'password chosen')
  .option('-p, --port <port>', 'port chosen')
  .option('-db, --database <database>', 'database chosen');
program.parse(process.argv);

// Check all parameters needed to start server
function checkParameters() {
  if(!program.port) {
    console.log('port missing !');
    process.exit(1);
  }

  if(!program.database) {
    console.log('database name missing !');
    process.exit(1);
  }

  if(!program.user) {
    console.log('user missing !');
    process.exit(1);
  }
}

checkParameters();



if(!program.database.startsWith('eatHealthy')) {
  console.log('Wrong database name !');
  process.exit(1);
}


// Starts the connection with mysql
const connection = mysql.createConnection({
    host : 'localhost',

    user : `${program.user}`,

    password:`${program.password}`,

    database : `${program.database}`

});
console.log(connection.config.database);

connection.connect();

const port = process.env.PORT || `${program.port}`;

const app = express()

    .use(cors())

    .use(bodyParser.json())

    .use(events(connection));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});

// Close server before exit
process.on('beforeExit', () => {
  console.log('Fermeture du serveur');
  connection.end()
});

