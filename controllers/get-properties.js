const { fetchProperties } = require("../models/get-properties");

exports.getProperties = async (req, res, next) => {
  const { property_type } = req.query;
  const validTypes = ["House", "Apartment", "Studio"];

  if (property_type && !validTypes.includes(property_type)) {
    return res.status(400).send({ msg: "Bad Request." });
  }
  const properties = await fetchProperties(property_type);
  res.status(200).send({ properties });
};
