const db = require("./create-connection");

async function seed() {
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
}

module.exports = seed;
