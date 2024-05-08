const express = require('express');
const cors = require('cors');

const authRoutes = require('./Routes/authRoutes');
const activitiesRoutes = require('./Routes/activitiesRoutes');
const pricingRoutes = require('./Routes/pricingRoutes');
const usersRoutes = require('./Routes/usersRoutes')
const galleryRoutes = require('./Routes/galleryRoutes')
const uploadRoutes = require('./Routes/uploadRoutes')

let app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
})

//* Creating Upload Endpoint for images
app.use('/images', express.static('uploads/images'))

// * ROUTES
app.use("/", authRoutes);
app.use("/activities", activitiesRoutes);
app.use("/pricing", pricingRoutes);
app.use("/user", usersRoutes)
app.use("/gallery", galleryRoutes)
app.use('/upload', uploadRoutes)

//* TEST ROUTE *
app.get('/', (req, res, next) => {
  res.status(200).json({
    status: 'Success',
    message: 'Online'
  })
  console.log('App started!');
})

module.exports = app