const db = require("./create-connection.js");

async function createPropertyTypes() {
  await db.query(`CREATE TABLE propertyTypes(
    property_type VARCHAR NOT NULL PRIMARY KEY,
    description TEXT NOT NULL 
    );`);
}

async function createUsers() {
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
}

async function createProperties() {
  await db.query(`CREATE TABLE properties(
    property_id SERIAL PRIMARY KEY,
    host_id INT NOT NULL REFERENCES users(user_id), 
    name VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    property_type VARCHAR NOT NULL REFERENCES propertyTypes(property_type),
    price_per_night DECIMAL NOT NULL,
    description TEXT

    );`);
}

async function createReviews() {
  await db.query(`CREATE TABLE reviews(
    review_id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES properties(property_id),
    guest_id INT NOT NULL REFERENCES users(user_id),
    rating INT NOT NULL, 
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
}

module.exports = {
  createPropertyTypes,
  createUsers,
  createProperties,
  createReviews,
};
