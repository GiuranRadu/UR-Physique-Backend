class CustomError extends Error {
  constructor(message, statusCode){
    super(message);
    this.name = this.constructor.name; // Set the name property to the class name
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = CustomError;


//  -> const error = new CustomError('some error message', 404) -> this expression will call the constructor of the above ↑↑↑ CustomError() ↑↑↑ , THIS IS HOW WE CAN INSTANTIATE A CLASS