const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send(`Running on port ${port}`);
});

app.listen(port,'0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`);
});
