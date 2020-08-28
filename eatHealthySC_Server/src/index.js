/*
Program needed to start the server related to the project

 */



const { program } = require('commander');
program
  .option('-u, --user <user>', 'user chosen')
  .option('-pwd, --password <password>', 'password chosen')
  .option('-p, --port <port>', 'port chosen')
  .option('-db, --database <database>', 'database chosen');

program.parse(process.argv);
console.log(program.port);
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

if(!program.password) {
  console.log('password missing !');
  process.exit(1);
}

console.log('PORT : ' + program.port + ' , USER :' + program.user + ' , DATABASE : ' + program.database + ' , PASSWORD : ' + program.password);

const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');

const mysql = require('mysql');

const events = require('./events');

const connection = mysql.createConnection({
    host : 'localhost',

    user : `${program.user}`,

    password:`${program.password}`,

    database : `${program.database}`

});

connection.connect();

const port = process.env.PORT || `${program.port}`;

const app = express()

    .use(cors())

    .use(bodyParser.json())

    .use(events(connection));

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});

