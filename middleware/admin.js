const { verify } = require("jsonwebtoken");


module.exports = (req, res, next) => {
  const token = req.get("x-admin-auth-token");
  if (!token || token === "") {
    req.isAuth = false;
    return res.status(401).send("Authorization failed..Token is empty");
  } else {
    let decoded;

    try {
      decoded = verify(token, process.env.JWT_SECRET);
      console.log(decoded);
    } catch (error) {
      req.isAuth = false;
      return res.status(401).send("Authorization failed..Not decoded");
    }

    if (!decoded) {
      req.isAuth = false;
      return res.status(401).send("Authorization failed..Third step");
    }

    if (decoded?.admin?.role !== 'admin') {
      req.isAuth = false;
      return res.status(401).send("Authorization failed..4th step ");
    }

    req.isAuth = true;
    req.admin = decoded.admin;
    return next();
  }
};