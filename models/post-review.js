const db = require("../db/create-connection");

exports.postPropertyReview = async (propertyId, guest_id, rating, comment) => {
  const { rows: insertedReview } = await db.query(
    `INSERT INTO reviews (review_id, property_id, guest_id, rating, comment, created_at) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *`,
    [propertyId, guest_id, rating, comment, created_at]
  );

  return { insertedReview };
};
