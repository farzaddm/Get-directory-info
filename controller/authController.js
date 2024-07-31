const jwt = require("jsonwebtoken");
const { checkUser, signupUser, insertLogin } = require("../database/index");
const useragent = require('useragent');
const requestIp = require('request-ip');
//===================================================================================

//create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (username, role) => {
  return jwt.sign({ id: username, role: role }, "farzad dehghan", {
    expiresIn: maxAge, // it's in s
  });
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.login_post = (req, res) => {
  const { username, password } = req.body;

  // دریافت اطلاعات دستگاه و مرورگر
  const agent = useragent.parse(req.headers['user-agent']);
  const device = agent.toString(); // اطلاعات دستگاه و مرورگر به صورت رشته
  const browser = agent.toAgent(); // نوع مرورگر
  const ip = requestIp.getClientIp(req); // دریافت IP کاربر

  // چک کردن اعتبارسنجی
  checkUser(username, password, (err, user) => {
    if (err) {
      return res.status(500).json({ errors: err.message });
    }

    if (user) {
      console.log("User exists and password matched!");
      const token = createToken(username, user.role);

      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

      const now = new Date().toISOString();
      insertLogin(user.username, now, device, ip, browser, (err) => {
        if (err) {
          return res.status(500).send("Database error");
        }
        res.status(200).json({ user: user.username, role: user.role });
      });
    } else {
      // ارسال وضعیت 400 وقتی که اعتبارسنجی موفق نباشد
      console.log("Invalid username or password.");
      res.status(400).json({ errors: "Failed to log in" });
    }
  });
};

module.exports.addUser_get = (req, res) => {
  res.render("admin/addUser");
};

module.exports.addUser_post = async (req, res) => {
  const { username, password } = req.body;
  try {
    await signupUser(username, password);
    res.status(200).json({ user: username });
  } catch (err) {
    console.log(err);
    res.status(400).json({ errors: "Failed to register user" });
  }
};

module.exports.logout_get = (req, res) => {
  //replace it with empty value and set a short maxAge to delete it
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports.admin_get = (req, res) => {
  res.render("admin");
};
