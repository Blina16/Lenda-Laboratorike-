const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const apiRouter = require('./routes');
app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: 'SERVER_ERROR', message: err.message || 'Unexpected error' });
});

module.exports = app;
