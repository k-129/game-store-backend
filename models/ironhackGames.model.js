const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const ihGamesSchema = new Schema(
  {
    title:{
      type: String,
      required: true
    },
    description:{
      type:String,
    },
    game_url:{
      type:String,
    },
    linkedin:{
      type: String,
    },
    github:{
      type:String
    },
    imgUrl:{
      type:String,
      default:""
    }
    
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const IronhackGames = model("IronhackGames", ihGamesSchema);

module.exports = IronhackGames;
