const express = require('express');
const router = express.Router();
const activitiesController = require('../Controllers/activitiesController')
const { protect } = require('../Controllers/authController')

//* PROTECT ALL BELOW ROUTES  *
//note: pt ca linia este scrisa deasupra `ROUTES`, va trece mai intai prin aceasta, apoi prin celelalte
//! GLOBAL
// router.use(protect)


//* ROUTES *
router.route('/')
  .get(activitiesController.getAllActivities)

router.route('/create')
  .post(activitiesController.createActivity)

router.route('/delete/:id')
  .delete(activitiesController.deleteActivity)

router.route('/edit/:id')
  .patch(activitiesController.editActivity)


module.exports = router;

