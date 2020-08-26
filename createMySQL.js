require('dotenv').config();
var mysql = require('mysql');
const dbName = process.env.DATABASE;

var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.NAME,
    password: process.env.PASSWORD
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