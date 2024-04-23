const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = require('../Utils/fileUpload.js')
const upload = multer({ storage: storage }).single('picture');

router.route('/')
  .post(upload, (req, res, next) => {
    // console.log(req.file);
    if (!req.file) {
      res.status(404).json({
        status: 'failed',
        message: 'File not found'
      })
    } else {
      res.json({
        success: 1,
        image_url: req.file.path
      })
    }
  })

module.exports = router;

//& pentru a salva local in folderul `/uploads/images/` ↓ ↓ ↓ 

// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const port = process.env.PORT || 3000;


// //* Image Storage Engine *
// const storage = multer.diskStorage({
//   destination: 'uploads/images',
//   filename: (req, file, cb) => {
//     return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
//   }
// });
// const upload = multer({ storage: storage }).single('picture');

// router.route('/')
//   .post(upload, (req, res, next) => {
//     console.log(storage);
//     if (!req.file) {
//       res.status(404).json({
//         status: 'failed',
//         message: 'File not found'
//       })
//     } else {
//       res.json({
//         success: 1,
//         image_url: `http://localhost:${port}/images/${req.file.filename}`
//       })
//     }
//   })

// module.exports = router;

//& pentru a salva local in folderul `/uploads/images/`