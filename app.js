const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('I am try to deploy a small docker project to two port which is 3000 and 8080 so u can check it and give me feeedback and suggestion')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(`This is from github and local`)
  console.log(`This is from git change`)
})