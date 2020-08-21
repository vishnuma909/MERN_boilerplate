const mongoose = require('../node_modules/mongoose');

//'mongodb://127.0.0.1:27017/<db name created in mongodbshell>'
const dbRoute = 'mongodb://127.0.0.1:27017/mern';
// connects our back end code with the database
try {
  mongoose.connect(dbRoute, { useNewUrlParser: true});
  mongoose.set('useCreateIndex', true) //index based id for objects

  let db = mongoose.connection;

  db.once('open', () => console.log('connected to the database')); //eventlistener for open connection

  // checks if connection with the database is successful
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
} catch (error) {
  console.log(error)
}