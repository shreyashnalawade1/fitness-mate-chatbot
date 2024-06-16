const tryCatch = (controller) => async (req, res, next) => {
  try {
    return await controller(req, res, next);
  } catch (error) {
    console.error(`Error occurred in ${req.originalUrl}: ${error}`);
    return next(error);
  }
};
module.exports = tryCatch;  


