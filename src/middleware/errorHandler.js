import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  let status = 500;
  let message = 'Internal Server Error';


  if (createHttpError.isHttpError(err)) {
    status = err.status;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(status).json({ message });
};
