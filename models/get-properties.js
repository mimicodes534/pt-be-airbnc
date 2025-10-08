const db = require("../db/create-connection");

exports.fetchProperties = async (property_type, maxPriceNum, minPriceNum) => {
  let propertyQuery = `SELECT p.property_id, p.name AS property_name , p.location, p.price_per_night, u.first_name AS host
          FROM properties p
          JOIN users u
          ON p.host_id = u.user_id`;

  const optionalQueryInfo = [];
  const conditions = [];

  if (property_type) {
    conditions.push(` p.property_type = $${optionalQueryInfo.length + 1}`);
    optionalQueryInfo.push(property_type);
  }

  if (maxPriceNum) {
    conditions.push(` p.price_per_night <= $${optionalQueryInfo.length + 1}`);
    optionalQueryInfo.push(maxPriceNum);
  }

  if (minPriceNum) {
    conditions.push(` p.price_per_night >= $${optionalQueryInfo.length + 1}`);
    optionalQueryInfo.push(minPriceNum);
  }

  if (conditions.length > 0) {
    propertyQuery += `WHERE ${conditions.join(" AND ")}`;
  }

  const { rows: properties } = await db.query(propertyQuery, optionalQueryInfo);

  return properties;
};
