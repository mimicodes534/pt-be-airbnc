const db = require("./create-connection");
const dropTables = require("./drop-tables.js");
const {
  createPropertyTypes,
  createUsers,
  createProperties,
  createReviews,
} = require("./create-tables.js");
const format = require("pg-format");

async function seed(
  formattedPropertyTypesData,
  formattedUsersData,
  formattedPropertiesData,
  formattedReviewsData
) {
  await dropTables();
  await createPropertyTypes();
  await createUsers();
  await createProperties();
  await createReviews();

  await db.query(
    format(
      `INSERT INTO propertyTypes (property_type, description)
    VALUES %L`,
      formattedPropertyTypesData
    )
  );

  const userInfo = await db.query(
    format(
      `INSERT INTO users (first_name, surname, email, phone_number, is_host, avatar)
    VALUES %L RETURNING user_id, first_name, surname`,
      formattedUsersData
    )
  );

  const hostComparison = {};
  userInfo.rows.forEach((user) => {
    const fullName = `${user.first_name.trim()} ${user.surname.trim()}`;
    hostComparison[fullName] = user.user_id;
  });

  const formattedPropertiesDataWithIDs = formattedPropertiesData.map(
    (property) => {
      const hostID = hostComparison[property[0]];
      return [
        hostID,
        property[1],
        property[2],
        property[3],
        property[4],
        property[5],
      ];
    }
  );

  const propertyInfo = await db.query(
    format(
      `INSERT INTO properties (host_id, name, location, property_type, price_per_night, description)
    VALUES %L RETURNING property_id, name`,
      formattedPropertiesDataWithIDs
    )
  );

  // property_id

  const propertyComparison = {};
  propertyInfo.rows.forEach((property) => {
    propertyComparison[property.name] = property.property_id;
  });

  // guest_id

  const guestComparison = {};
  userInfo.rows.forEach((user) => {
    const fullName = `${user.first_name} ${user.surname}`;
    guestComparison[fullName] = user.user_id;
  });

  const formattedReviewsWithIDs = formattedReviewsData.map((review) => {
    return [
      propertyComparison[review.property_name],
      guestComparison[review.guest_name],
      review.rating,
      review.comment,
    ];
  });

  await db.query(
    format(
      `INSERT INTO reviews (property_id, guest_id, rating, comment)
      VALUES %L`,
      formattedReviewsWithIDs
    )
  );
}

module.exports = seed;
