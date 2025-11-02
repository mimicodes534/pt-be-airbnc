const { postPropertyReview } = require("../models/post-review");

exports.newReview = async (req, res, next) => {
  const propertyId = req.params.id;

  if (!/^\d+$/.test(propertyId)) {
    return res.status(400).json({ msg: "Bad Request." });
  }

  if (!req.body) {
    return res.status(404).json({ msg: "Property not found." });
  }

  const { guest_id, rating, comment } = req.body;

  if (!guest_id || !rating || !comment) {
    return res.status(400).send({ msg: "Bad Request." });
  }

  const insertedReview = await postPropertyReview(
    propertyId,
    guest_id,
    rating,
    comment
  );
  res.status(201).send(insertedReview);
};
