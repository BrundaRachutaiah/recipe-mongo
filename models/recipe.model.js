const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Please add an author"],
      trim: true,
    },
    difficulty: {
      type: String,
      required: [true, "Please add a difficulty level"],
      enum: ["Easy", "Intermediate", "Difficult"],
    },
    prepTime: {
      type: Number,
      required: [true, "Please add preparation time"],
    },
    cookTime: {
      type: Number,
      required: [true, "Please add cooking time"],
    },
    ingredients: {
      type: [String],
      required: [true, "Please add ingredients"],
    },
    instructions: {
      type: [String],
      required: [true, "Please add instructions"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please add an image URL"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
