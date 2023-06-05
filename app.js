// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/api", authRoutes);

const gamesRoutes = require("./routes/game.routes");
app.use("/api", gamesRoutes);

const ironGamesRoutes = require("./routes/ironhackGames.routes");
app.use("/api", ironGamesRoutes);

const favRoutes = require("./routes/favorites.routes");
app.use("/api", favRoutes);



module.exports = app;
