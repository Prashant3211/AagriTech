
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["farmer", "admin"],
      default: "farmer",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.User ||
  mongoose.model("User", UserSchema);
