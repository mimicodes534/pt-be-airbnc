const db = require("../db/create-connection");

exports.removeReview = async (reviewId) => {
  const { rows: property } = await db.query(
    "SELECT * FROM properties WHERE property_id = $1",
    [propertyId]
  );

  if (property.length === 0) {
    return Promise.reject({ status: 404, msg: "Property not found." });
  }

  await db.query(
    `DELETE FROM reviews
     WHERE review_id = $1;`,
    [reviewId]
  );
};
