const { propertyTypesData } = require("./index");

const formattedPropertyTypesData = propertyTypesData.map((type) => {
  return [type.property_type, type.description];
});

module.exports = formattedPropertyTypesData;
