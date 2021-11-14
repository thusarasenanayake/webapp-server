const app = require('./services/express')
const mongooseConnection = require('./services/mongoose')
app.start();
mongooseConnection.start();
