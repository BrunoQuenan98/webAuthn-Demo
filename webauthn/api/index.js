const express = require('express');
const app = express();
const port = 8080;

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })

app.get('/',(_req, _res) =>{
    console.log('hola');
})  