const { fetchProperties } = require("../models/get-properties");

exports.getProperties = async (req, res, next) => {
  try {
    const { property_type, max_price, min_price } = req.query;

    const properties = await fetchProperties(
      property_type,
      max_price,
      min_price
    );

    res.status(200).send({ properties });
  } catch (err) {
    next(err);
  }
};
