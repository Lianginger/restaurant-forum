const express = require('express')
const app = express()
const port = 3000
const handlebars = require('express-handlebars')

app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
  res.render('home')
})

app.listen(port, () => {
  console.log(`App is running on ${port}`)
})