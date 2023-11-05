import { SinonStub, stub } from "sinon";
import { expect } from "chai";
import * as AuthController from "../src/controllers/auth";
import User from "../src/models/user";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

interface IResponse {
  success: boolean;
  status_message: string;
  results?: object;
}

describe("Auth Controller - postLogin", () => {
  let findOneStub: SinonStub;
  let compareStub: SinonStub;
  let req: Request;
  let res: any;

  before(() => {
    req = {
      body: {
        email: "test@test.com",
        password: "tester",
      },
    } as Request;

    res = {
      statusCode: 500,
      data: {} as IResponse,
      status: function (code: number) {
        this.statusCode = code;
        return this;
      },
      json: function (data: IResponse) {
        this.data = data;
      },
    };
    findOneStub = stub(User, "findOne");
    compareStub = stub(bcrypt, "compare");
  });
  after(() => {
    findOneStub.restore();
    compareStub.restore();
  });

  it("Should throw an error if it cannot find a user", async () => {
    findOneStub.returns(Promise.resolve(null));

    await AuthController.postLogin(req, res);
    expect(res.statusCode).to.equal(404);
    expect(res.data.success).to.equal(false);
    expect(res.data.status_message).to.equal("user not found");
  });

  it("should return a token when the user is logged in successfully", async () => {
    compareStub.returns(true);
    const dummyUser = {
      email: "test@test.com",
      hashedPassword: "tester",
      fullName: "Test",
      id: 1,
    };
    findOneStub.returns(Promise.resolve(dummyUser));

    await AuthController.postLogin(req, res);
    expect(res).to.have.property("statusCode", 200);
    expect(res.data).to.have.property("success", true);
    expect(res.data).to.have.property("status_message", "logged in user");
    expect(res.data.results).to.have.property("access_token");
    expect(res.data.results).to.have.property("userId", 1);
    expect(res.data.results).to.have.property("userFullName", "Test");
  });

  it("should return status code 401 when passwords does not match", async () => {
    compareStub.returns(false);

    await AuthController.postLogin(req, res);
    expect(res).to.have.property("statusCode", 401);
    expect(res.data).to.have.property("status_message", "wrong password");
  });

  it("should return status code 500 when a database error occurs", async () => {
    findOneStub.throws();

    await AuthController.postLogin(req, res);
    expect(res).to.have.property("statusCode", 500);
    expect(res.data).to.have.property("success", false);
    expect(res.data).to.have.property(
      "status_message",
      "internal server error"
    );
  });
});
