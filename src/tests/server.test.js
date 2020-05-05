import "babel-polyfill";
const app = require("../server/server.js"); 
const supertest = require("supertest");
const request = supertest(app);

it("Check the server", async (done) => {
  const response = await request.get("/");

  expect(response.status).toBe(200);
  done();
});