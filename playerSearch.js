require('dotenv').config();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

const maxAge = 21;
const min90s = 13;
const numOfResults = 9;
const position = "'MF'";

var tables = [];
var columns = [];

tables.push(process.env.POSSESSION_TABLE);
columns.push("PrgDist");
tables.push(process.env.POSSESSION_TABLE);
columns.push("Succ");
tables.push(process.env.POSSESSION_TABLE);
columns.push("`Succ%`");

tables.push(process.env.PASSING_TABLE);
columns.push("`T_Cmp%`");
tables.push(process.env.PASSING_TABLE);
columns.push("T_PrgDist");
tables.push(process.env.PASSING_TABLE);
columns.push("FinalThird");

tables.push(process.env.MISCELLANEOUS_TABLE);
columns.push("`Won%`");

tables.push(process.env.DEFENCE_TABLE);
columns.push("`Int`");
tables.push(process.env.DEFENCE_TABLE);
columns.push("`Vs_Tkl%`");

var queries = [];
for (i = 0; i < columns.length; i++) {
    const query = `SELECT Rk FROM ${tables[i]} WHERE Pos = ${position} AND 90s > ${min90s} AND Age < ${maxAge} ORDER BY ${columns[i]} DESC LIMIT ${numOfResults}`;
    queries.push(query);
}

sqlSequence(connection, queries, columns, tables);

async function sqlSequence(connection, queries, columns, tables) {
    async function getResults(connection, query) {
        searchResults = [];
        var promise = new Promise(function (resolve, reject) {
            connection.query(query, (err, result) => {
                if (err) {
                    return reject(err);
                }
                for (i = 0; i < result.length; i++) {
                    searchResults.push(result[i].Rk);
                }
                resolve(searchResults);
            });
        });
        await promise;
        return searchResults;
    };

    var results = [];
    results = await getResults(connection, queries[0]);
    async function processQueries(queries, connection) {
        for (let i = 1; i < queries.length; i++) {
            var result = await getResults(connection, queries[i]);
            results = results.concat(result);
        }
    }
    await processQueries(queries, connection);

    var frequency = [];
    visited = -1;

    for (i = 0; i < results.length; i++) {
        count = 1;
        for (j = i + 1; j < results.length; j++) {
            if (results[i] == results[j]) {
                count++;
                frequency[j] = visited;
            }
        }
        if (frequency[i] != visited) {
            frequency[i] = count;
        }
    }

    rkString = "(";
    for (i = 0; i < frequency.length; i++) {
        if (frequency[i] === queries.length) {
            rkString = rkString + results[i].toString() + ",";
        }
    }

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

    if (rkString.length > 1) {
        rkString = rkString.slice(0, -1);
        rkString = rkString + ")";
        for (i = 0; i < columns.length; i++) {
            const query = `SELECT Player, Age, ${columns[i]} FROM ${tables[i]} WHERE Rk in ${rkString}`;
            await getDeatailedResults(connection, query);
        }
    } else {
        console.log("No results.")
    }

    connection.end((err) => {

    });
};