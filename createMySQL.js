require('dotenv').config();
var mysql = require('mysql');
const dbHost = process.env.HOST;
const dbUser = process.env.NAME;
const dbPassword = process.env.PASSWORD;
const dbName = process.env.DATABASE;

var connection = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
});
connection.query(`CREATE DATABASE ${dbName}`, (err) => {
    if (err) throw err;
    console.log('Database created');
});
connection.end((err) => {

});