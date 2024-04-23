const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


//* USER SCHEMA *
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: [20, 'Name must not exceed 20 characters'],
    minlength: [3, 'Name must have at least 3 characters'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, "Age field is required"],
    min: [16, "Age must be between 16 and 60"],
    max: [60, "Age must be between 16 and 60"]
  },
  height: {
    type: Number,
    required: [true, 'Please enter your height'],
    min: [120, "Age must be between 120 and 240"],
    max: [240, "Age must be between 120 and 240"]
  },
  weight: {
    type: Number,
    required: [true, 'Please enter your weight'],
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  subscription: {
    type: String,
    enum: ["none", "entry", "moderate", "hardcore"],
    default: 'none'
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    validate: {
      validator: function (value) {
        // Custom validator to check for at least 8 characters,1 number, and 1 special character
        const regex = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return regex.test(value);
      },
      message: "Password must have a minimum length of 8 characters, at least 1 number, and 1 special character",
    },
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (value) {
        return value === this.password
      },
      message: 'Passwords & Confirm Password does not match'
    }
  },
  passwordChangedAt: {
    type: Date
  },
  activitiesAttended: [{
    _id: { type: mongoose.Schema.ObjectId, ref: "Activities" },
    caloriesBurned: Number,
    activityName: String,
    duration: Number,
    day: String,
  }],
  gallery: [{
    picture: String,
    description: String
  }],
  passwordResetToken: String,
  passwordResetExpires: Date,
})

//* PRE-SAVE Hook - hash password 
userSchema.pre('save', async function (next) {
  let user = this //! this = req.body
  if (!user.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordChangedAt = Date.now() - 2000
  next();
})


//* COMPARE password from req.body with DB hashed password 
userSchema.methods.comparePassword = async function (passwordBody, passwordDB) {
  return await bcrypt.compare(passwordBody, passwordDB) //!boolean
}


//* CHECK if password is changed 
userSchema.methods.isPasswordChanged = async function (jwtInitialTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(Date.parse(this.passwordChangedAt) / 1000);
    let passwordChanged = jwtInitialTimestamp < passwordChangedTimestamp
    return passwordChanged //!boolean
  }
  return false
}


//*CREATE TOKEN for password reset 
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Note: 10 min timeout
  // console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};

//* Aici se creeaza colectia `USERS` , din User -> Users
const User = mongoose.model('User', userSchema);
module.exports = User