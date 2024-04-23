const mongoose = require('mongoose');

//* ACTIVITY SCHEMA *
const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    maxlength: [20, 'Name must not exceed 20 characters'],
    minlength: [3, 'Name must have at least 3 characters'],
    trim: true
  },
  burnedCaloriesPerHour: {
    type: Number,
    required: [true, 'Burned Calories no. are required'],
    min: [100, "Calories no. must be between 100 and 1000km"],
    max: [1000, "Calories no. must be between 100 and 1000km"]
  },
  difficulty: {
    type: String,
    enum: ["easy", "moderate", "hard", "extreme"],
    required: [true, 'Difficulty required, choose between [easy, moderate, hard]']

  },
  pictures: {
    type: [String],
    required: [true, 'At least one picture must be provided']
  }
}, {
  toJSON: {
    virtuals: true,
    versionKey: false, //! This hides the '__v' field
    transform: function (doc, ret) {
      delete ret.id; //! This removes the 'id' field       
    }
  },
  toObject: { virtuals: true }
}
)

const Activity = mongoose.model('Activity', activitySchema)

module.exports = Activity