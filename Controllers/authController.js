const User = require('../Models/userModel')
const jwt = require('jsonwebtoken')
const util = require('util');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler')
const CustomError = require('./../Utils/CustomError');
const sendEmail = require('./../Utils/email');
const crypto = require('crypto');


exports.register = async (req, res, next) => {
  // res.status(200).send(JSON.stringify({statusbar: 'success', message: 'Register functioneaza'}))
  // res.status(200).send({statusbar: 'success', message: 'Register functioneaza'})
  // res.status(200).json({statusbar: 'success', message: 'Register functioneaza'}) 
  // console.log('Register functioneaza');
  try {
    const newUser = await User.create(req.body)

    res.status(200).json({
      status: 'success',
      message: `User ${req.body.name} created succesfully`,
      data: newUser
    })
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    })
  }
}

exports.login = async (req, res, next) => {
  // res.status(200).json({ statusbar: 'success', message: 'Login functioneaza' })
  // console.log('Login functioneaza');
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.requestedAt);
  //note: Verify if email and password in req.body
  if (!email || !password) {
    return res.status(400).json({  //! we use `return` because if not email or password we want to stop the function here     
      status: 'failed',
      message: 'Please provide email and password for login'
    })
  }

  //note: Find `user` document in "USERS" collection with specified `email`
  const userDB = await User.findOne({ email: email })
  if (!userDB) {
    return res.status(400).json({
      status: "failed",
      message: "Incorrect email or password"
    });
  }

  //note: Verify if the found `user` password is correct
  const isPasswordValid = await userDB.comparePassword(password, userDB.password)
  if (!isPasswordValid) {
    return res.status(400).json({
      status: "failed",
      message: "Incorrect email or password"
    });
  }

  const token = jwt.sign({ id: userDB._id }, process.env.SECRET_STR, { expiresIn: process.env.LOGIN_EXPIRES })

  res.status(200).json({
    status: "success",
    token,
    data: userDB
  })
}

//* FORGOT password 
exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  //. 1. Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).json({
      status: "failed",
      message: "User not found"
    })
  }

  //. 2. Generate the random reset token
  const resetToken = await user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false });//note: saves the changes made to the user document but skips the validation step.

  //. 3. Sent it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/login/resetPassword/${resetToken}`;
  const message = `Forgot your password?\n\n✅Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n\nYour reset code is: ${resetToken} \n\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10min)',
      message
    })
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new CustomError("There was an error sending the email. Try again later!"), 500);
  }
})



exports.resetPassword = asyncErrorHandler(async (req, res, next) => {

  try {
    //. 1. Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })
  
    //. 2. If token has not expired, and there is a user, set the new password
    if (!user) {
      return next(new CustomError("Token is invalid or has expired", 400))
    }
    user.password = req.body.password
    user.confirmPassword = req.body.confirmPassword
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  
    //. 3. Update passwordChangedAt property for the user
    // user.passwordChangedAt = Date.now()
  
    //. 4. Log the user in, send JWT
    const token = jwt.sign({ id: user._id }, process.env.SECRET_STR, { expiresIn: process.env.LOGIN_EXPIRES });
  
    res.status(200).json({
      status: "success",
      token,
    })
    
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message
    })
  }
})



//* PROTECT -> check if `user` is logged in -> block routes when `user` is NOT logged in
exports.protect = async (req, res, next) => {
  try {
    //* 1. Verify if req has token, if yes -> we save it in a variable   
    const valueToken = req.headers.authorization;
    let token;
    if (valueToken && valueToken.startsWith('bearer')) {
      token = valueToken.split(" ")[1]
    }
    if (!token) {
      return res.status(401).json({
        status: 'failed',
        message: "You are not logged in"
      })
    }

    //* 2. Verify if token is valid (or expired)
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);
    console.log(decodedToken);

    //* 3. Verify if token's USER is registered in DB (maybe he is deleted after login)
    const currentUser = await User.findById(decodedToken.id)
    if (!currentUser) {
      return res.status(401).json({
        status: 'failed',
        message: "The user doesn't exist"
      })
    }

    //* 4. Verify if USER has changed the password after login
    const isPasswordChanged = await currentUser.isPasswordChanged(decodedToken.iat);

    if (isPasswordChanged) {
      return res.status(401).json({
        status: 'failed',
        message: "The password was changed, please login again"
      })
    }

    //* 5. We allow the USER to access the route -> using `next()`
    req.user = currentUser
    // console.log(req);
    next()

  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message
    })
  }
}


