const mongoose = require('mongoose');

const { MONGO_URI, MONGO_DBNAME } = process.env;

mongoose
  .connect(MONGO_URI, {
    dbName: MONGO_DBNAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log(err.message);
  });

mongoose.connection.on('connected', () => {
  console.log('mongoose connected to db');
});

mongoose.connection.on('error', (err) => {
  console.log(err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('mongoose disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
