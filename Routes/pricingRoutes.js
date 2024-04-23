const express = require('express');
const router = express.Router();
const pricingController = require('../Controllers/pricingController')

const { protect } = require('../Controllers/authController')


//* PROTECT ALL BELOW ROUTES  *
//note: pt ca linia este scrisa deasupra `ROUTES`, va trece mai intai prin aceasta, apoi prin celelalte
//! GLOBAL
// router.use(protect)


//* ROUTES *
router.route('/')
  .post(pricingController.selectSubscription)
  .get(pricingController.getAllCategories)

router.route('/sportsIncludedInSubscription')
  .post(pricingController.sportsIncludedInSubscription)

router.route('/allSubscriptions')
  .get(pricingController.allSubscriptions)


module.exports = router;
