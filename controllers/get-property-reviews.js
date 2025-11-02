const { fetchPropertyReviews } = require("../models/get-property-reviews");

exports.getPropertyReviews = async (req, res, next) => {
  const propertyId = req.params.id;
  const { reviews, average_rating } = await fetchPropertyReviews(propertyId);
  if (reviews.length === 0) {
    return res.status(404).json({ msg: "No reviews found." });
  }
  res.status(200).send({ reviews, average_rating });
};
