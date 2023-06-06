const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");

router.put("/add-favorites/:userId/:gameId", async (req, res) => {
  try {
    const { gameId, userId } = req.params;
    /*     const userId = req.session.currentUser._id */
    const isInFav = true
    const updateUser = await User.findByIdAndUpdate(userId, {
      $push: { favGames: gameId },
    });

    res.json(updateUser, isInFav);
  } catch (error) {
    next(error);
  }
});

router.post("/remove-favorites/:userId/:gameId", async (req, res) => {
  try {
    const { gameId, userId } = req.params;

    const updateUser = await User.findByIdAndUpdate(userId, {
      $pull: { favGames: gameId },
    });


    res.json(updateUser);
  } catch (error) {
    next(error);
  }
});

// Export Routes
module.exports = router;
