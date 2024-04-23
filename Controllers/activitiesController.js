const Activity = require('../Models/activityModel')
const ApiFeatures = require('./../Utils/ApiFeatures');


exports.createActivity = async (req, res, next) => {
  try {
    const activity = await Activity.create(req.body)

    res.status(200).send({
      status: 'success',
      message: 'Activity created successfully'
    })

  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    })
  }
}

exports.deleteActivity = async (req, res, next) => {
  try {
    const activityToDeleteId = await Activity.findByIdAndDelete(req.params.id)
    if (!activityToDeleteId) {
      return res.status(404).json({
        status: 'failed',
        message: 'Activity with provided ID not found'
      })
    }
    res.status(200).json({
      status: 'success',
      message: 'Activity deleted successfully'
    })
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    })
  }
}


exports.editActivity = async (req, res, next) => {
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!updatedActivity) {
      res.status(404).json({
        status: 'failed',
        message: 'Activity with provided id not found'
      })
    }

    res.status(200).json({
      status: 'success',
      data: updatedActivity
    })

    // console.log(updatedActivity);
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
}

exports.getAllActivities = async (req, res, next) => {
  const features = new ApiFeatures(Activity.find(), req.query).filter().sort().limitFields().paginate();
  let activities = await features.query

  res.status(200).json({
    status: 'success',
    count: activities.length,
    activities
  })
}

