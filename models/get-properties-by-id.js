const db = require("../db/create-connection");

exports.fetchPropertiesByID = async (propertyId) => {
  const { rows } = await db.query(
    "SELECT * FROM properties WHERE property_id = $1",
    [propertyId]
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Property not found." });
  }
  return rows[0];
};
