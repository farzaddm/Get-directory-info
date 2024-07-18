const jwt = require("jsonwebtoken");
const {login_get, login_post, logout_get,} = require("../controller/authController");
const { checkUser } = require("../database/database");
// ====================================================================================================================

// Mocking dependencies
jest.mock("jsonwebtoken");
jest.mock("bcrypt");
jest.mock("../database/database");

describe("Auth Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      cookies: {},
    };

    // Mocking the function of response object
    res = {
      render: jest.fn(),
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      redirect: jest.fn(),
    };
  });

  describe("login_get", () => {
    test("should render the login page", () => {
      login_get(req, res);
      expect(res.render).toHaveBeenCalledWith("login");
    });
  });

  describe("login_post", () => {
    test("should authenticate user and set jwt cookie on success", async () => {
      // Setting up request body with username and password
      req.body = { username: "farzad", password: "test1234" };

      // Mocking checkUser function
      checkUser.mockImplementation((username, password, callback) => {
        // Simulating callback with user object on successful authentication
        callback(null, { username, role: "user" });
      });

      // Mocking jwt.sign function to return a fake JWT token
      jwt.sign.mockReturnValue("fake-jwt-token");

      await login_post(req, res);

      // Expecting function calls and their arguments
      expect(checkUser).toHaveBeenCalledWith(
        "farzad",
        "test1234",
        expect.any(Function)
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: "farzad", role: "user" },
        "farzad dehghan",
        { expiresIn: 3 * 24 * 60 * 60 }
      );
      expect(res.cookie).toHaveBeenCalledWith("jwt", "fake-jwt-token", {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: "farzad" });
    });

    test("should return status 400 for invalid username or password", async () => {
      req.body = { username: "testuser", password: "wrongpassword" };

      // Mocking checkUser function
      checkUser.mockImplementation((username, password, callback) => {
        // Simulating callback with null for invalid authentication
        callback(null, null);
      });

      await login_post(req, res);

      // Expecting function calls and their arguments
      expect(checkUser).toHaveBeenCalledWith(
        "testuser",
        "wrongpassword",
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("logout_get", () => {
    test("should clear the jwt cookie and redirect to home page", () => {
      logout_get(req, res);
      expect(res.cookie).toHaveBeenCalledWith("jwt", "", { maxAge: 1 }); // Expecting jwt cookie to be cleared
      expect(res.redirect).toHaveBeenCalledWith("/"); // Expecting redirection to home page
    });
  });
});