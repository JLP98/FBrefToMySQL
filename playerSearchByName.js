require('dotenv').config();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

const name = "Koulibaly";

var tables = [];
var columns = [];

tables.push(process.env.PASSING_TABLE);
columns.push("T_PrgDist");

tables.push(process.env.POSSESSION_TABLE);
columns.push("PrgDist");

tables.push(process.env.DEFENCE_TABLE);
columns.push("`Vs_Tkl%`");

tables.push(process.env.MISCELLANEOUS_TABLE);
columns.push("`Won%`");

sqlSequence(connection, columns, tables);

async function sqlSequence(connection, columns, tables) {
    async function getDeatailedResults(connection, query) {
        connection.query(query, (err, result) => {
            if (err) {
                throw err;
            }
            console.log("\n\n");
            for (i = 0; i < result.length; i++) {
                console.log(result[i]);
            }
        });
    };

    for (i = 0; i < columns.length; i++) {
        const query = `SELECT Player, Age, Squad, ${columns[i]} FROM ${tables[i]} WHERE Player LIKE '%${name}%'`;
        await getDeatailedResults(connection, query);
    }

    connection.end((err) => {

    });
};