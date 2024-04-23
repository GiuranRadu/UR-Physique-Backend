const User = require('../Models/userModel')

exports.getAllPictures = async (req, res, next) => {
  try {
    const allPictures = await User.aggregate([
      {
        $unwind: '$gallery'
      },
      {
        $group: {
          _id: "gallery",
          pictures: { '$push': '$gallery' }
        }
      }
    ])
    res.status(200).json({
      status: 'success',
      allPictures
    })

  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: "Something went wrong...⚠️",
      error: error.message
    })
  }
}

exports.addPictureToGallery = async (req, res, next) => {
  const { userId, picture, description } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, {
      $push: {
        gallery: [
          {
            picture,
            description
          }
        ]
      }
    }, { new: true }) //! punem asta pentru a ne intoarce mai jos obiectul deja modificat

    res.status(200).json({
      status: 'success',
      user
    })
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: "Something went wrong...⚠️",
      error: error.message
    })
  }
}


exports.removePictureFromGallery = async (req, res, next) => {
  try {
    const imageId = req.params.id;
    const userId = req.body.userId;

    const user = await User.findByIdAndUpdate(userId, {
      $pull: { gallery: { _id: imageId } }
    }, { new: true }) //! punem asta pentru a ne intoarce mai jos obiectul deja modificat);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};