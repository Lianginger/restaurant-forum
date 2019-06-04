const express = require('express')
const app = express()
const port = 3000
const handlebars = require('express-handlebars')
const db = require('./models')

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.listen(port, () => {
  db.sequelize.sync()
  console.log(`App is running on ${port}`)
})


require('./routes')(app)