import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  let status = 500;
  let message = 'Internal Server Error';

  if (err instanceof HttpError) {
    status = err.status;
    message = err.message || err.name;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(status).json({ message });
};
