var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /sqlTest/{Airline}/{Country}/{Touchpoint}
 *   get:
 *     summary: Retrieve flight by Airline, Country and Touchpoint.
 *     description: Retrieve flight by Airline, Country and Touchpoint.
 *     parameters:
 *       - name: Airline
 *         in: path
 *         description: The Airline of the flight to retrieve
 *         required: true
 *         schema:
 *           type: string
 *        - name: Country
 *         in: path
 *         description: The Country of the flight to retrieve
 *         required: true
 *         schema:
 *           type: string
 *         - name: Touchpoint
 *         in: path
 *         description: The Touchpoint of the flight to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flight data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Airline:
 *                   type: string
 *                 Country:
 *                   type: string
 *                 Touchpoint:
 *                   type: string
 *       404:
 *         description: Flight not found
 */

const config = {
    server: '77.170.251.180',
    authentication: {
        type: 'default',
        options: {
            userName: 'Mex',
            password: 'Mex14'
        }
    },
    options: {
        encrypt: false,
        database: 'FlightDB',
        rowCollectionOnRequestCompletion: true,
        port: 1433
    }
};

/* GET users listing. */
router.get('/sqlTest/:Airline/:Country/:Touchpoint', function (req, res, next) {
    const { Airline, Country, Touchpoint } = req.params;

    const { Connection, Request } = require('tedious');
    const connection = new Connection(config);

    connection.on('connect', err => {
        if (err) {
            console.error('Connection failed:', err);
            res.status(500).json({ error: 'Database connection failed.' });
            return;
        } else {
            const request = new Request(`SELECT TOP 100 * FROM Vluchten2024touchpoints WHERE AirlineShortName = '${Airline}' AND Country = '${Country}' AND Touchpoint = '${Touchpoint}'`, (err, rowCount, rows) => {
                if (err) {
                    console.error('Error executing query:', err);
                    res.status(500).json({ error: 'Query execution failed.' });
                    return;
                } else {
                    const results = rows.map(row => {
                        let result = {};
                        row.forEach(column => {
                            result[column.metadata.colName] = column.value;
                        });
                        return result;
                    });
                    res.status(200).json(results); // Send the actual query results
                }
                connection.close(); // Ensure the connection is closed
            });

            connection.execSql(request);
        }
    });

    connection.connect();
});




module.exports = router;
