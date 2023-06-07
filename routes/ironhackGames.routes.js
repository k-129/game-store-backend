const router = require("express").Router();

const mongoose = require("mongoose");

// Require Data Models
const IronhackGame = require("../models/ironhackGames.model");

// File uploader
const fileUploader = require("../config/cloudinary.config");

// POST ROUTE that Creates a new game

router.post("/ironhack/add-game", async (req, res) => {
  const { title, description, game_url, linkedin, github, imgUrl } = req.body;

  try {
    // We wait until we have the status of the creation of games to make the next step
    let response = await IronhackGame.create({
      title,
      description,
      game_url,
      linkedin,
      github,
      imgUrl,
    });
    // Send the response as a json file, because we're making an API
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

// GET ROUTE that Lists the Projects
router.get("/ironhack/games", async (req, res) => {
  try {
    let allGames = await IronhackGame.find();
    res.json(allGames);
  } catch (error) {
    res.json(error);
  }
});

// GET ROUTE to display specific info of a game
router.get("/ironhack/games/:gameId", async (req, res) => {
  const { gameId } = req.params;

  if (!gameId) {
    // status of 2xx is successful.
    // error with 4xx is client-side.
    // error with 5xx is server-side
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  try {
    let foundGame = await IronhackGame.findById(gameId);
    res.status(200).json(foundGame);
  } catch (error) {
    res.json(error);
  }
});

// PUT /api/projects/:projectId to update info of a Project

router.put("/ironhack/games/edit/:gameId", async (req, res) => {
  const { gameId } = req.params;
  const { title, description, game_url, linkedin, github, game_img } = req.body;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  try {
    let updatedGame = await IronhackGame.findByIdAndUpdate(
      gameId,
      { title, description, game_url, linkedin, github, game_img },
      { new: true }
    );
    res.json(updatedGame);
  } catch (error) {
    res.json(error);
  }
});

router.delete("/ironhack/games/:gameId", async (req, res) => {
  const { gameId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  try {
    await IronhackGame.findByIdAndRemove(gameId);
    res.json({ message: `Game with ${gameId} is removed.` });
  } catch (error) {
    res.json(error);
  }
});

// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("imgUrl"), (req, res, next) => {
  // console.log("file is: ", req.file)

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

  res.json({ fileUrl: req.file.path });
});

module.exports = router;
