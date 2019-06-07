const express = require('express')
const app = express()
const port = 3000
const handlebars = require('express-handlebars')
const db = require('./models')
const bodyParser = require('body-parser')

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, () => {
  db.sequelize.sync()
  console.log(`App is running on ${port}`)
})


require('./routes')(app)