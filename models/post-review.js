const db = require("../db/create-connection");

exports.postPropertyReview = async (propertyId, guest_id, rating, comment) => {
  const { rows: property } = await db.query(
    "SELECT * FROM properties WHERE property_id = $1",
    [propertyId]
  );

  if (property.length === 0) {
    return Promise.reject({ status: 404, msg: "Property not found." });
  }

  const { rows } = await db.query(
    `INSERT INTO reviews (property_id, guest_id, rating, comment) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *`,
    [propertyId, guest_id, rating, comment]
  );
  return rows[0];
};
