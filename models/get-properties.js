const db = require("../db/create-connection");

exports.fetchProperties = async (property_type) => {
  let propertyQuery = `SELECT p.property_id, p.name AS property_name , p.location, p.price_per_night, u.first_name AS host
          FROM properties p
          JOIN users u
          ON p.host_id = u.user_id`;

  const optionalQueryInfo = [];

  if (property_type) {
    propertyQuery += ` WHERE p.property_type = $1`;
    optionalQueryInfo.push(property_type);
  }

  const { rows: properties } = await db.query(propertyQuery, optionalQueryInfo);

  return properties;
};
