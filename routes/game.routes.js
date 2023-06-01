const router = require('express').Router();

const mongoose = require('mongoose');

// Require Data Models
const Game = require('../models/Game.model');

// POST ROUTE that Creates a new game

router.post('/games', async (req,res)=>{
    const {title, thumbnail, short_description, game_url, genre, platform, publisher, developer, release_date, freetogame_profile_url} = req.body;

    try{
        // We wait until we have the status of the creation of games to make the next step
        let response = await Game.create({title, thumbnail, short_description, game_url, genre, platform, publisher, developer, release_date, freetogame_profile_url});
        // Send the response as a json file, because we're making an API
        res.json(response);
    }
    catch(error){
        res.json(error);
    }


});

// GET ROUTE that Lists the Projects
router.get('/games', async(req,res)=>{
    try{
        let allGames = await Game.find();
        res.json(allGames);
        console.log(allGames);
    }
    catch(error){
        res.json(error);
    }
});

// GET ROUTE to display specific info of a game
router.get('/games/:gameId', async (req,res)=>{
    const {gameId} = req.params;

    if(!gameId){
        // status of 2xx is successful.
        // error with 4xx is client-side.
        // error with 5xx is server-side 
        res.status(400).json({message: 'Specified id is not valid'});
        return;
    }

    try{
        let foundGame = await Game.findById(gameId);
        res.status(200).json(foundGame);
    }
    catch(error){
        res.json(error);
    }
});

// PUT /api/projects/:projectId to update info of a Project

router.put('/games/:gameId', async (req, res)=>{
    const {gameId} = req.params;
    const {title, description} = req.body;

    if(!mongoose.Types.ObjectId.isValid(projectId)){
       res.status(400).json({message: 'Specified Id is not valid'}); 
       return; 
    }

    try{
        let updatedProject = await Project.findByIdAndUpdate(gameId, 
        {title, description}, {new: true});
        res.json(updatedProject);
    }
    catch(error){
        res.json(error);
    }
});

router.delete('/projects/:projectId', async(req,res)=>{
    const {projectId} = req.params;

    if(!mongoose.Types.ObjectId.isValid(projectId)){
        res.status(400).json({message: 'Specified Id is not valid'}); 
        return; 
    }

    try{
        await Project.findByIdAndRemove(projectId);
        res.json({message: `Project with ${projectId} is removed.`})
    }
    catch(error){
        res.json(error);
    }
});

module.exports = router; 


