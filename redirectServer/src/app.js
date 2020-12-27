const express = require('express');
const app = express();

require('dotenv').config();

if (!process.env.APP_NAME) {
  throw new TypeError('APP_NAME is missing in env.');
}

app.get('/redirect/trello', (req, res) => {
  res.redirect(`${process.env.APP_NAME}://trello?code${req.query.code}`);
});

const port = process.env.PORT ?? 3001;

app.listen(port, () => {
  console.log(`App listening on ${port} port.`);
});
