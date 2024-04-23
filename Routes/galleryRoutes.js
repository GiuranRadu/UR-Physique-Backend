const express = require('express');
const router = express.Router();
const galleryController = require('./../Controllers/galleryController')


//* ROUTES *
router.route('/getAllPictures')
  .get(galleryController.getAllPictures)

router.route('/addPictureToGallery')
  .post(galleryController.addPictureToGallery)

router.route('/removePictureFromGallery/:id')
  .delete(galleryController.removePictureFromGallery)



module.exports = router;
