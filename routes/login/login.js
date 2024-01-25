const express = require("express");
const router = express.Router();
const { queryDatabase } = require('../../services/db/query');
const { comparePassword, generateAuthToken, getUser } = require('./query');
const msj = require('../../templates/messages');

router.post('/', async (req, res) => {
  const { email, pass } = req.body;
  try {
    const userQuery = await getUser(email);
    const [user] = await queryDatabase(userQuery.query, userQuery.value);

    if (user) {
      if (comparePassword(pass, user.Password)) {
        const token = await generateAuthToken({
          UserName: user.UserName,
        });
        res.json({
          token,
          userName: user.UserName,
          role: user.Role,
          parishId: user.ParishId
        });
      } else {
        res.status(500).json({ message: msj.loginError });
      }
    } else {
      res.status(500).json({ message: msj.loginNoUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: msj.errorQuery });
  }
});

module.exports = router;
