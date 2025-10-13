const { removeReview } = require("../models/delete-review");

exports.deleteReview = async (req, res, next) => {
  const reviewId = req.params.id;

  await removeReview(reviewId);
  res.status(204).send();
};
