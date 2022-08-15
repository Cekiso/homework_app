const express = require('express')
const cors = require('cors')
const PgPromise = require("pg-promise");
const app = express()
require('dotenv').config()

const API = require('./api.js')
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors())

const DATABASE_URL = process.env.DATABASE_URL;
const config = {
    connectionString: DATABASE_URL,
    max: 30,
    ssl: { rejectUnauthorized: false }
}
if (process.env.NODE_ENV == 'production') {
    config.ssl = {
        rejectUnauthorized: false
    }
}
const pgp = PgPromise({});
const db = pgp(config);

API(app, db);

let PORT = process.env.PORT;
// console.log(PORT);

app.listen(PORT, function() {
    console.log('App starting on port', PORT);
})



// const supertest = require('supertest');
// const PgPromise = require("pg-promise");
// const express = require('express');
// const assert = require('assert');
// const fs = require('fs');
// const bcrypt = require('bcrypt');
// require('dotenv').config()
// const API = require('./api');

// const { default: axios } = require('axios');
// const cors = require('cors')

// const app = express();
// app.use(cors())
// app.use(express.json());
// app.use(express.static('public'));

// const config = {
//     connectionString: process.env.DATABASE_URL || 'postgres://nkully:nkully@localhost:5432/homework_app',
//     max: 30,
//     ssl: { rejectUnauthorized: false }
// };

// const pgp = PgPromise({});
// const db = pgp(config);
// // const db = pgp(DATABASE_URL);
// API(app, db);
// const PORT = process.env.PORT || 8585;
// // API routes to be added here
// app.get('/', async function(req, res) {
//     console.log(req.query)
// });
// app.listen(PORT, function() {
//     console.log(`App started on port ${PORT}`)
// });



