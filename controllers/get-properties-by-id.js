const { fetchPropertiesByID } = require("../models/get-properties-by-id.js");

exports.getPropertiesByID = async (req, res, next) => {
  const propertyId = req.params.id;
  const property = await fetchPropertiesByID(propertyId);
  res.status(200).send({ property });
};
