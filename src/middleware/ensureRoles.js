const ensureRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user.roles) {
      return res.sendStatus(401);
    }

    const allowedRolesArray = [...allowedRoles];
    const userRoles = req.user.roles;

    const result = userRoles
      .map((role) => allowedRolesArray.includes(role))
      .find((val) => val === true);

    if (!result) {
      return res.sendStatus(401);
    }

    next();
  };
};

module.exports = ensureRoles;
