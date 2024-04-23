const User = require('./../Models/userModel')
const Activities = require('./../Models/activityModel')

exports.addActivity = async (req, res, next) => {
  const { userId, activityId, duration, caloriesBurned, day , activityName } = req.body
  try {
    // 1. Find activity in Activities collection
    const activityToAdd = await Activities.findById(activityId)
    const user = await User.findByIdAndUpdate(userId, {
      $push: {
        activitiesAttended: {
          _id: activityId,
          activityName,
          caloriesBurned,
          duration,
          day
        }
      }
    }, { new: true }) //! punem asta pentru a ne intoarce mai jos obiectul deja modificat

    res.status(200).json({
      status: 'success',
      data: user
    })

  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: "Something went wrong...⚠️",
      error: error.message
    })
  }
}

exports.removeActivity = async (req, res, next) => {
  const { userId, activityId } = req.body
  try {
    const user = await User.findByIdAndUpdate(
      { _id: userId }, // Query condition to find the user by userId
      { $pull: { activitiesAttended: { _id: activityId } }, },  // Update operation to remove activity by activityId
      { new: true }
    );

    res.status(200).json({
      status: "success",
      data: user
    })

  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: "Something went wrong...⚠️",
      error: error.message
    })
  }
}


const { ObjectId } = require('mongodb'); //! (a) ASTA trebuie importat
exports.getActivitiesByDay = async (req, res, next) => {
  const { userId, day } = req.body;
  try {
    const data = await User.aggregate([
      // { $match: { _id: ObjectId.createFromHexString(userId) } }, // Creating ObjectId from hex string
      { $match: { _id: new ObjectId(userId) } }, //! (a) works the same way as above 
      { $unwind: "$activitiesAttended" },
      {
        $match: {
          "activitiesAttended.day": day
        }
      },
      {
        $group: {
          _id: "$activitiesAttended.day",
          count: { $sum: 1 },
          activities: { $push: "$activitiesAttended" },
        }
      }
    ]);

    res.status(200).json({
      status: "success",
      data
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: "Something went wrong...⚠️",
      error: error.message
    });
  }
};

exports.getAllSelectedUserActivities = async (req, res, next) => {
  const { userId } = req.body;
  try {

    const data = await User.aggregate([
      // { $match: { _id: ObjectId.createFromHexString(userId) } }, // Creating ObjectId from hex string
      { $match: { _id: new ObjectId(userId) } }, //! (a) works the same way as above 
      { $unwind: "$activitiesAttended" },

      {
        $group: {
          _id: "$activitiesAttended.day",
          count: { $sum: 1 },
          activities: { $push: "$activitiesAttended" },
        }
      },
      { $sort: { "_id": 1 } } // Sort by day of the week

    ]);

    res.status(200).json({
      status: "success",
      data
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: "Something went wrong...⚠️",
      error: error.message
    });
  }
}