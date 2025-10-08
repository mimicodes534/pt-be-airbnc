const { fetchProperties } = require("../models/get-properties");

exports.getProperties = async (req, res, next) => {
  const { property_type, max_price, min_price } = req.query;

  const maxPriceNum = Number(max_price);
  const minPriceNum = Number(min_price);

  const validTypes = ["House", "Apartment", "Studio"];

  if (property_type && !validTypes.includes(property_type)) {
    return res.status(400).send({ msg: "Bad Request." });
  }
  const properties = await fetchProperties(
    property_type,
    maxPriceNum,
    minPriceNum
  );
  res.status(200).send({ properties });
};
