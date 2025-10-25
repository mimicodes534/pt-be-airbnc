const db = require("../db/create-connection");

exports.fetchProperties = async (
  property_type,
  max_price,
  min_price,
  sort,
  order
) => {
  const checkProperty = async (property_type) => {
    const { rows } = await db.query(
      `SELECT * FROM properties WHERE property_type = $1;`,
      [property_type]
    );

    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Property not found." });
    }
  };

  let propertyQuery = `SELECT p.property_id, p.name AS property_name , p.location, p.price_per_night, u.first_name AS host
          FROM properties p
          JOIN users u
          ON p.host_id = u.user_id`;

  const optionalQueryInfo = [];
  const conditions = [];

  if (property_type) {
    await checkProperty(property_type);
    conditions.push(` p.property_type = $${optionalQueryInfo.length + 1}`);
    optionalQueryInfo.push(property_type);
  }

  if (max_price) {
    conditions.push(` p.price_per_night <= $${optionalQueryInfo.length + 1}`);
    optionalQueryInfo.push(max_price);
  }

  if (min_price) {
    conditions.push(` p.price_per_night >= $${optionalQueryInfo.length + 1}`);
    optionalQueryInfo.push(min_price);
  }

  if (conditions.length > 0) {
    propertyQuery += ` WHERE ${conditions.join(" AND ")}`;
  }

  const validSortFields = {
    cost_per_night: "p.price_per_night",
  };

  const validOrders = ["ascending", "descending"];

  if (sort) {
    if (!validSortFields[sort]) {
      return Promise.reject({ status: 400, msg: "Invalid sort field." });
    }

    const sortField = validSortFields[sort];
    let sortOrder = "ASC";

    if (order) {
      if (!validOrders.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid order direction." });
      }
      sortOrder = order === "ascending" ? "ASC" : "DESC";
    }

    propertyQuery += ` ORDER BY ${sortField} ${sortOrder}`;
  }

  const { rows: properties } = await db.query(propertyQuery, optionalQueryInfo);

  return properties;
};
