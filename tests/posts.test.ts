import request from "supertest";
require("dotenv").config();
import app from "../src/app";
import sequelize from "../src/util/db";
import User from "../src/models/user";
import jwt from "jsonwebtoken";
let token: any;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  const user = await User.create({
    fullName: "admin",
    email: "admin@admin.com",
    hashedPassword: "admin",
  });
  token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || "83n89j9190j@4j",
    {
      expiresIn: "15d",
    }
  );
});

describe("test create route", () => {
  test("should have success, status_message and results when created", async () => {
    const post = { content: "yoo" };

    const res = await request(app)
      .post("/api/v1/posts")
      .set("Authorization", `Bearer ${token}`)
      .send(post);

    console.log(res.body);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("status_message");
    expect(res.body).toHaveProperty("results");
    expect(res.body).toHaveProperty("results.postId");
    expect(res.body).toHaveProperty("results.userId");
    expect(res.body).toHaveProperty("results.userFullName");
  });
});
