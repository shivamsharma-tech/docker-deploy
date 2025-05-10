const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send(`This page comes from git push -> jenkins -> create image -> deploye to  aws -> start container in port ${port}`);
});

app.listen(port,'0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`);
});
