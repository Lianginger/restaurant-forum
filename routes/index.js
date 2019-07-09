module.exports = app => {
  app.use('/', require('./routes'))
  app.use('/api', require('./apis'))
}
