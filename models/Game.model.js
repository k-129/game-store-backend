const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    title: {
      type: String,
      
    },
    thumbnail: {
      type: String,
      
    },
    short_description: {
      type: String,
      
    },
    
    game_url: {
      type: String,
      
    },
    genre: {
      type: String,
      
    },
    platform: {
      type: String,
      
    },
    publisher: {
      type: String,
      
    },
    developer: {
      type: String,
      
    },
    release_date: {
      type: String,
      
    },
    freetogame_profile_url: {
      type: String,
      
    },
    bucket_list:{
      type: Schema.Types.ObjectId, 
      ref: 'BucketList' 
    }
    
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Game = model("Game", userSchema);

module.exports = Game;
