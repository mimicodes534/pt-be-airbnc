const db = require("../db/create-connection");

exports.postPropertyReview = async (propertyId, guest_id, rating, comment) => {
  const { rows } = await db.query(
    `INSERT INTO reviews (property_id, guest_id, rating, comment) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *`,
    [propertyId, guest_id, rating, comment]
  );

  return rows[0];
};
