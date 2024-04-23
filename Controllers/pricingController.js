const User = require('./../Models/userModel')
const Activities = require('./../Models/activityModel')

exports.selectSubscription = async (req, res, next) => {
  try {
    const userId = req.body.userId
    const selectedUser = await User.findById(userId)
    // console.log(selectedUser.name);

    if (!selectedUser) {
      res.status(404).json({
        status: 'failed',
        message: 'User not found'
      })
    } else {
      let result = await User.findByIdAndUpdate(selectedUser, req.body, { new: true, runValidators: true })

      res.status(200).json({
        status: 'success',
        user: result
      })
    }
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: "Something went wrong...⚠️",
      error: error.message
    })
  }
}

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Activities.aggregate([
      {
        $unwind: '$difficulty'
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          count: { $sum: 1 },
          activities: { $push: '$$ROOT' }
        }
      }
    ])
    res.status(200).json({
      status: 'success',
      categories
    })
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: "Something went wrong...⚠️",
      error: error.message
    })
  }
}

exports.sportsIncludedInSubscription = async (req, res, next) => {
  const subscription = req.body.subscription
  try {
    if (subscription === 'hardcore') {
      const result = await Activities.find()
      res.status(200).json({
        status: 'success',
        length: result.length,
        data: result
      })
    } else if (subscription === 'moderate') {
      const result = await Activities.find({ "difficulty": { $ne: "hard" } }); //! EXCLUDE 
      res.status(200).json({
        status: 'success',
        length: result.length,
        data: result
      })
    } else if (subscription === 'entry') {
      const result = await Activities.find({ "difficulty": "easy" });
      res.status(200).json({
        status: 'success',
        length: result.length,
        data: result
      })
    } else {
      res.status(200).json({
        status: 'success',
        data: []
      })
    }
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: "Something went wrong...⚠️",
      error: error.message
    })
  }
}

exports.allSubscriptions = async (req, res, next) => {
  try {
    const hardcore = await Activities.find()
    const moderate = await Activities.find({ "difficulty": { $ne: "hard" } }); //! EXCLUDE 
    const entry = await Activities.find({ "difficulty": "easy" });

    const entryObject = { name: 'entry', availableActivities: entry };
    const moderateObject = { name: 'moderate', availableActivities: moderate };
    const hardcoreObject = { name: 'hardcore', availableActivities: hardcore };

    res.status(200).json({
      status: 'success',
      data: [entryObject, moderateObject, hardcoreObject]

    })

  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: "Something went wrong...⚠️",
      error: error.message
    })
  }
}