const jwt = require("jsonwebtoken");
//===========================================================================================

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exist & is varified
  if (token) {
    jwt.verify(token, "farzad dehghan", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

// check user access
const checkRole = (role) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (userRole === role) {
      next();
    } else {
      res.status(403).send('Access Denied');
    }
  };
};


module.exports = { requireAuth, checkRole };
