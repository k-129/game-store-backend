const router = require('express').Router();

const mongoose = require('mongoose');

// Require Data Models
const IronhackGame = require('../models/ironhackGames.model');

// POST ROUTE that Creates a new game

router.post('/ironhack/add-game', async (req,res)=>{
    const {title, description, game_url, linkedin, github, game_img} = req.body;

    try{
        // We wait until we have the status of the creation of games to make the next step
        let response = await IronhackGame.create({title, description, game_url, linkedin, github, game_img});
        // Send the response as a json file, because we're making an API
        res.json(response);
    }
    catch(error){
        res.json(error);
    }


});

// GET ROUTE that Lists the Projects
router.get('/ironhack/games', async(req,res)=>{
    try{
        let allGames = await IronhackGame.find();
        res.json(allGames);
    }
    catch(error){
        res.json(error);
    }
});

// GET ROUTE to display specific info of a game
router.get('/ironhack/games/:gameId', async (req,res)=>{
    const {gameId} = req.params;

    if(!gameId){
        // status of 2xx is successful.
        // error with 4xx is client-side.
        // error with 5xx is server-side 
        res.status(400).json({message: 'Specified id is not valid'});
        return;
    }

    try{
        let foundGame = await IronhackGame.findById(gameId);
        res.status(200).json(foundGame);
    }
    catch(error){
        res.json(error);
    }
});

  

// PUT /api/projects/:projectId to update info of a Project

router.put('/ironhack/games/edit/:gameId', async (req, res)=>{
    const {gameId} = req.params;
    const {title, description, game_url, linkedin, github, game_img} = req.body;

    if(!mongoose.Types.ObjectId.isValid(gameId)){
       res.status(400).json({message: 'Specified Id is not valid'}); 
       return; 
    }

    try{
        let updatedGame = await IronhackGame.findByIdAndUpdate(gameId, 
        {title, description, game_url, linkedin, github, game_img}, {new: true});
        res.json(updatedGame);
    }
    catch(error){
        res.json(error);
    }
});

router.delete('/ironhack/games/:gameId', async(req,res)=>{
    const {gameId} = req.params;

    if(!mongoose.Types.ObjectId.isValid(gameId)){
        res.status(400).json({message: 'Specified Id is not valid'}); 
        return; 
    }

    try{
        await IronhackGame.findByIdAndRemove(gameId);
        res.json({message: `Game with ${gameId} is removed.`})
    }
    catch(error){
        res.json(error);
    }
});

module.exports = router; 


