const db = require("./create-connection");
const format = require("pg-format");

async function seed(
  formattedPropertyTypesData,
  formattedUsersData,
  formattedPropertiesData,
  formattedReviewsData
) {
  await db.query(`DROP TABLE IF EXISTS reviews;`);
  await db.query(`DROP TABLE IF EXISTS properties;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS propertyTypes;`);

  await db.query(`CREATE TABLE propertyTypes(
    property_type VARCHAR NOT NULL PRIMARY KEY,
    description TEXT NOT NULL 
    );`);

  await db.query(`CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    surname VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone_number VARCHAR,
    is_host BOOL NOT NULL,
    avatar VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 
    );`);

  await db.query(`CREATE TABLE properties(
    property_id SERIAL PRIMARY KEY,
    host_id INT NOT NULL REFERENCES users(user_id), 
    name VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    property_type VARCHAR NOT NULL REFERENCES propertyTypes(property_type),
    price_per_night DECIMAL NOT NULL,
    description TEXT

    );`);

  await db.query(`CREATE TABLE reviews(
    review_id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES properties(property_id),
    guest_id INT NOT NULL REFERENCES users(user_id),
    rating INT NOT NULL, 
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);

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
    const fullName = `${user.first_name.trim()} ${user.surname.trim()}`;
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

  const check = await db.query(
    format(
      `INSERT INTO reviews (property_id, guest_id, rating, comment)
      VALUES %L`,
      formattedReviewsWithIDs
    )
  );
}

module.exports = seed;
