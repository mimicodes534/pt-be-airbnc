const request = require("supertest");
const app = require("../app.js");
const db = require("../db/create-connection.js");
const seed = require("../db/seed.js");
const formattedPropertyTypesData = require("../db/data/test/property-types-sort.js");
const formattedUsersData = require("../db/data/test/users-sort.js");
const formattedPropertiesData = require("../db/data/test/properties-sort.js");
const formattedReviewsData = require("../db/data/test/reviews-sort.js");

beforeEach(async () => {
  await seed(
    formattedPropertyTypesData,
    formattedUsersData,
    formattedPropertiesData,
    formattedReviewsData
  );
});

afterAll(async () => {
  await db.end();
});

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

      expect(properties.length).toBe(11);

      properties.forEach((property) => {
        expect(property).toHaveProperty("property_id");
        expect(property).toHaveProperty("property_name");
        expect(property).toHaveProperty("location");
        expect(property).toHaveProperty("price_per_night");
        expect(property).toHaveProperty("host");
      });
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
        .get("/api/properties/?property_type=invalid-id")
        .expect(400);
      expect(body.msg).toBe("Bad Request.");
    });

    test("optional query responds with properties less than or equal to max price", async () => {
      const {
        body: { properties },
      } = await request(app).get("/api/properties/?max_price=100").expect(200);
      properties.forEach((property) => {
        expect(+property.price_per_night).toBeLessThanOrEqual(100);
        expect(properties.length).toBeGreaterThan(0);
      });
    });

    test("optional query responds with properties more than or equal to min price", async () => {
      const {
        body: { properties },
      } = await request(app).get("/api/properties/?min_price=100").expect(200);

      properties.forEach((property) => {
        expect(+property.price_per_night).toBeGreaterThanOrEqual(100);
        expect(properties.length).toBeGreaterThan(0);
      });
    });
  });

  describe("GET /api/users/:id", () => {
    test("responds with status of 200", async () => {
      await request(app).get("/api/users/1").expect(200);
    });

    test("body has property of user", async () => {
      const { body } = await request(app).get("/api/users/1");
      expect(body).toHaveProperty("user");
    });

    test("user has user_id, first_name, surname, email, phone_number, created_at properties", async () => {
      const {
        body: { user },
      } = await request(app).get("/api/users/1");

      expect(user).toHaveProperty("user_id");
      expect(user).toHaveProperty("first_name");
      expect(user).toHaveProperty("surname");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("phone_number");
      expect(user).toHaveProperty("created_at");
    });

    test("responds with 400 and error message if invalid user id", async () => {
      const { body } = await request(app).get("/api/users/invalid").expect(400);
      expect(body.msg).toBe("Bad Request.");
    });
  });
  describe("GET /api/properties/:id/reviews", () => {
    test("responds with status of 200", async () => {
      await request(app).get("/api/properties/1/reviews").expect(200);
    });

    test("body has property of reviews", async () => {
      const { body } = await request(app).get("/api/properties/1/reviews");
      expect(body).toHaveProperty("reviews");
    });

    test("reviews has review_id, comment, rating, created_at, guest properties", async () => {
      const {
        body: { reviews },
      } = await request(app).get("/api/properties/1/reviews");

      expect(reviews.length).toBe(3);

      reviews.forEach((review) => {
        expect(review).toHaveProperty("review_id");
        expect(review).toHaveProperty("comment");
        expect(review).toHaveProperty("rating");
        expect(review).toHaveProperty("created_at");
        expect(review).toHaveProperty("guest");
      });
    });

    test("body has an average rating key", async () => {
      const { body } = await request(app).get("/api/properties/1/reviews");
      expect(body).toHaveProperty("average_rating");
      expect(body.average_rating).toBe(3);
    });

    test("responds with 400 and error message if invalid review parameter", async () => {
      const { body } = await request(app)
        .get("/api/properties/invalid/reviews")
        .expect(400);
      expect(body.msg).toBe("Bad Request.");
    });
  });

  describe("POST /api/properties/:id/reviews", () => {
    test("responds with status of 201", async () => {
      const payload = {
        guest_id: 1,
        rating: 5,
        comment: "Amazing stay!",
      };
      await request(app)
        .post("/api/properties/1/reviews")
        .send(payload)
        .expect(201);
    });

    test("review has correct properties added", async () => {
      const payload = {
        guest_id: 1,
        rating: 5,
        comment: "Amazing stay!",
      };
      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(payload);

      expect(body).toHaveProperty("review_id");
      expect(body).toHaveProperty("property_id", 1);
      expect(body).toHaveProperty("guest_id", 1);
      expect(body).toHaveProperty("rating", 5);
      expect(body).toHaveProperty("comment", "Amazing stay!");
      expect(body).toHaveProperty("created_at");
    });

    test("responds with 400 and error message if invalid review param", async () => {
      const { body } = await request(app)
        .post("/api/properties/invalid/reviews")
        .expect(400);
      expect(body.msg).toBe("Bad Request.");
    });
  });

  describe("DELETE /api/reviews/:id", () => {
    test("responds with status code of 204 and actually deletes row", async () => {
      await request(app).delete("/api/reviews/1").expect(204);
      const reviewId = 1;
      const { rows } = await db.query(
        "SELECT * FROM reviews WHERE review_id = $1",
        [reviewId]
      );
      expect(rows.length).toBe(0);
    });

    test("responds with 400 and error message if invalid review param", async () => {
      const { body } = await request(app)
        .delete("/api/reviews/invalid")
        .expect(400);
      expect(body.msg).toBe("Bad Request.");
    });
  });
});
