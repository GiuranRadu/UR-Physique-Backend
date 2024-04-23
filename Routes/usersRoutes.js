const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController')

const { protect } = require('../Controllers/authController')

//* PROTECT ALL BELOW ROUTES  *
//note: pt ca linia este scrisa deasupra `ROUTES`, va trece mai intai prin aceasta, apoi prin celelalte
//! GLOBAL
// router.use(protect)

//* ROUTES *
// ......
router.route('/')
  .post(userController.addActivity)
  .delete(userController.removeActivity)


router.route('/day')
  .post(userController.getActivitiesByDay)

router.route('/getAllSelectedUserActivities')
  .post(userController.getAllSelectedUserActivities)




module.exports = router;