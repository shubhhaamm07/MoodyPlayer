const express = require('express');
const Songrouter = require('./routes/songs.routes');
const app = express();
app.use(express.json());
app.use('/', Songrouter);
module.exports = app;