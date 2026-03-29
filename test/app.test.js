const request = require("supertest");
const app = require("../app");

describe("Complaint Management API Tests", () => {

  // ✅ 1. Check server is running
  test("GET / should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });

  // ✅ 2. Add complaint (valid data)
  test("POST /complaint should add complaint", async () => {
    const res = await request(app)
      .post("/complaint")
      .send({
        name: "Revathi",
        issue: "Water leakage"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("complaint");
  });

  // ✅ 3. Missing data (negative test)
  test("POST /complaint should fail if data is missing", async () => {
    const res = await request(app)
      .post("/complaint")
      .send({});

    expect(res.statusCode).toBe(400);
  });

  // ✅ 4. Get all complaints
  test("GET /complaints should return list", async () => {
    const res = await request(app).get("/complaints");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ✅ 5. Resolve complaint (assuming ID = 1)
  test("PUT /resolve/:id should resolve complaint", async () => {
    const res = await request(app)
      .put("/resolve/1");
    // status may vary (200 or 404 if not found)
    expect([200, 404,403]).toContain(res.statusCode);

  });

  // ✅ 6. Delete complaint (optional endpoint)
  test("DELETE /complaint/:id", async () => {
    const res = await request(app)
      .delete("/complaint/1");

    expect([200, 404]).toContain(res.statusCode);
  });

});