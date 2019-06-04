const express = require('express')
const app = express()
const port = 3000
const handlebars = require('express-handlebars')

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.listen(port, () => {
  console.log(`App is running on ${port}`)
})


require('./routes')(app)