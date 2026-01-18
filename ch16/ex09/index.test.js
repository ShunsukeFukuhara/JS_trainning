import request from "supertest";
import path from "path";
import { fileURLToPath } from "url";
import { createApp } from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Mirror API", () => {
  const rootDirectory = path.resolve(__dirname, "public");
  const app = createApp(rootDirectory);

  test("POST /test/mirror echoes request", async () => {
    const res = await request(app)
      .post("/test/mirror")
      .set("X-Test-Header", "hello")
      .send("test body");

    expect(res.status).toBe(200);
    expect(res.text).toContain("POST / HTTP/");
    expect(res.text).toContain("x-test-header: hello");
    expect(res.text).toContain("test body");
  });

  test("static file is served", async () => {
    const res = await request(app).get("/test.txt");
    console.log("static root:", rootDirectory);

    expect(res.status).toBe(200);
    expect(res.text).toBe("Hello, World!");
  });

  test("non-existent file returns 404", async () => {
    const res = await request(app).get("/nonexistent.txt");
    expect(res.status).toBe(404);
  });

  test("prohibits directory traversal", async () => {
    const res = await request(app).get("/../index.js");
    const res2 = await request(app).get("/../test.txt");
    expect(res.status).toBe(404);
    expect(res2.status).toBe(200);
  });
});
