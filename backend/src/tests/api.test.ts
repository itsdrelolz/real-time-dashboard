import request from "supertest";
import app from "../api/app";

describe("API Health Check", () => {
  it("should return 200 for health check", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("should return API status", async () => {
    const response = await request(app).get("/api");
    expect(response.status).toBe(200);
    expect(response.text).toBe("API is running");
  });
});

describe("Authentication Required Routes", () => {
  it("should return 401 for protected routes without auth", async () => {
    const protectedRoutes = [
      "/api/projects",
      "/api/conversations",
      "/api/messages",
      "/api/notifications",
    ];

    for (const route of protectedRoutes) {
      const response = await request(app).get(route);
      expect(response.status).toBe(401);
    }
  });
});

describe("CORS Configuration", () => {
  it("should include CORS headers", async () => {
    const response = await request(app).options("/api/health");
    expect(response.headers["access-control-allow-origin"]).toBeDefined();
  });
});
