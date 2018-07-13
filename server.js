const express = require('express')
const app = express()

app.use(express.static('node_modules/paper/dist'));
app.use(express.static('node_modules/dat.gui/build'));

app.use(express.static('public'))
app.listen(3000, () => console.log('Example app listening on port 3000!'))
