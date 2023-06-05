const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js"); 

 router.post('/add-favorites/:gameId', async (req,res)=>{
try {
    const {gameId} = req.params; 
    const userId = req.session.currentUser._id

    await User.findByIdAndUpdate(userId, {$push: {favorites: gameId}})

    res.json(`/games/${gameId}`)
    
} catch (error) {
    next(error)
}
 }); 

 router.post('/remove-favorites/:gameId', async (req,res)=>{
try {
    const {gameId} = req.params; 
    const userId = req.session.currentUser._id

    await User.findByIdAndUpdate(userId, {$pull: {favorites: gameId}})

    res.json(`/games/${gameId}`)
    
} catch (error) {
    next(error)
}
 }); 

 
 // Export Routes
 module.exports = router;

 