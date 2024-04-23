const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })

//-> SAFETY NET error handlers -> must be on the top level of the page, before `app`
process.on('uncaughtException', (err) => {
  console.log(err.stack);
  console.log('❌ Uncaught exception occured! Shutting down... ❌');
  // server.close(() => process.exit(1)); 
});

const app = require('./app');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');


mongoose.connect(process.env.CONN_STR, {
  useNewUrlParser: true,
}).then((conn) => {
  console.log('💪 UR-Physique 💪-> DB connection established... ✅');
}).catch((err) => console.log('DB connection failed ⛔'))

const server = app.listen(port, () => {
  console.log(`Server has started on port: ${port}... ✅ `);
});