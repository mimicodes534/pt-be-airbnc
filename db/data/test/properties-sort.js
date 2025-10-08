const { propertiesData } = require("./index.js");

const formattedPropertiesData = propertiesData.map((type) => {
  return [
    type.host_name,
    type.name,
    type.location,
    type.property_type,
    type.price_per_night,
    type.description,
  ];
});

module.exports = formattedPropertiesData;
