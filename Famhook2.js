var express = require('express');
var userRoutes = require('./Router/UserRoutes.js');
var app = express()

// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })
app.use('/api/member',userRoutes);
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})