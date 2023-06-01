const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name:{
      type: String,
    },
    description:{
      type:String,
    },
    games:[{
      type: Schema.Types.ObjectId, 
      ref: 'Game' 
    }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const BucketList = model("BucketList", userSchema);

module.exports = BucketList;
