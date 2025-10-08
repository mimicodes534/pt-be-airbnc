const request = require("supertest");
const app = require("../app.js");
const db = require("../db/create-connection");

describe("app", () => {
  test("sends back 404 error for invalid path", async () => {
    const { body } = await request(app).get("/invalid/path").expect(404);
    expect(body.msg).toBe("Path not found.");
  });

  describe("GET /api/properties", () => {
    test("responds with status of 200", async () => {
      await request(app).get("/api/properties").expect(200);
    });

    test("body has property of properties", async () => {
      const { body } = await request(app).get("/api/properties");
      expect(body).toHaveProperty("properties");
    });

    test("property has property_id, property_name, location, price_per_night, host properties", async () => {
      const {
        body: { properties },
      } = await request(app).get("/api/properties");
      console.log(properties);
      const property = properties[0];
      expect(property).toHaveProperty("property_id");
      expect(property).toHaveProperty("property_name");
      expect(property).toHaveProperty("location");
      expect(property).toHaveProperty("price_per_night");
      expect(property).toHaveProperty("host");
    });
  });

  describe("GET /api/properties optional requests", () => {
    test("optional query responds with properties that match the passed type", async () => {
      const {
        body: { properties },
      } = await request(app)
        .get("/api/properties/?property_type=House")
        .expect(200);
      expect(properties.length).toBe(3);
    });

    test("responds with 400 and error message if invalid property type", async () => {
      const { body } = await request(app)
        .get("/api/properties/?property_type=cat")
        .expect(400);
      expect(body.msg).toBe("Bad Request.");
    });

    test("optional query responds with properties less than or equal to max price", async () => {
      const {
        body: { properties },
      } = await request(app).get("/api/properties/?max_price=100").expect(200);
      properties.forEach((property) => {
        expect(property.price_per_night).toBeLessThanOrEqual(100);
      });
    });

    test("optional query responds with properties more than or equal to min price", async () => {
      const {
        body: { properties },
      } = await request(app).get("/api/properties/?min_price=100").expect(200);

      properties.forEach((property) => {
        expect(property.price_per_night).toBeMoreThanOrEqual(100);
      });
    });
  });
});

afterAll(async () => {
  await db.end();
});
