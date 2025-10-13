const { postPropertyReview } = require("../models/post-review");

exports.newReview = async (req, res, next) => {
  const { guest_id, rating, comment } = req.body;
  const propertyId = req.params.id;
  const insertedReview = await postPropertyReview(
    propertyId,
    guest_id,
    rating,
    comment
  );
  res.status(201).send(insertedReview);
};
