const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    about_me:{
      type: String,
      default: "Tell us about yourself",
    },
    imgUrl:{
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    admin: { 
      type:Boolean, 
      default: false,
    },
    favGames: {
      type:[{
        type: Schema.Types.ObjectId,
        ref: "Game"
    }]
  }
    
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
