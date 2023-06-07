require("dotenv").config();
const mongoose = require('mongoose').default;

  const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
  } = process.env;

  const options = {
    connectTimeoutMS: 10000,
    useUnifiedTopology: true,
  };

  const url = `mongodb://${MONGO_USERNAME || 'root'}:${MONGO_PASSWORD || 'example'}@${MONGO_HOSTNAME || '127.0.0.1'}:${MONGO_PORT || '27017'}/${MONGO_DB || 'users'}?authSource=admin&useUnifiedTopology=true`;

  mongoose.connect(url, options).then( function() {
    console.log('MongoDB is connected');
  })
    .catch( function(err) {
      console.log(err);
    });

module.exports = {
  mongoose
}
