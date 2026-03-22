export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors,
    });
  }
  req.body = result.data;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors,
    });
  }
  req.query = result.data;
  next();
};
