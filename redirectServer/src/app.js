const express = require('express');
const app = express();
const path = require('path');

require('dotenv').config();

if (!process.env.APP_NAME) {
  throw new TypeError('APP_NAME is missing in env.');
}

app.get('/redirect/trello', (req, res) => {
  // res.redirect(`${process.env.APP_NAME}://trello?code${req.query.code}`);

  res.sendFile(path.resolve(__dirname, '..', 'trelloAuth.html'));
});

const port = process.env.PORT ?? 3001;

app.listen(port, () => {
  console.log(`App listening on ${port} port.`);
});
