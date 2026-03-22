export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  res.status(500).json({ message: 'Internal server error' });
};
