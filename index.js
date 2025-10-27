const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db/db.connect");
const Recipe = require("./models/recipe.model");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Connect to Database once at startup
connectDB();

/** ✅ Root Route */
app.get("/", (req, res) => {
  res.status(200).json({ message: "🍽️ Recipe API running successfully!" });
});

/** ✅ Create new recipe */
app.post("/recipes", async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** ✅ Get all recipes */
app.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** ✅ Get recipe by title */
app.get("/recipes/title/:title", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ title: req.params.title });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** ✅ Get recipes by author */
app.get("/recipes/author/:author", async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.params.author });
    if (!recipes.length)
      return res.status(404).json({ message: "No recipes found" });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** ✅ Get recipes by difficulty (Easy) */
app.get("/recipes/difficulty/easy", async (req, res) => {
  try {
    const recipes = await Recipe.find({ difficulty: "Easy" });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** ✅ Update difficulty by ID */
app.put("/recipes/:id/difficulty", async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      { difficulty: req.body.difficulty },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** ✅ Update prepTime & cookTime by title */
app.put("/recipes/title/:title/time", async (req, res) => {
  try {
    const updated = await Recipe.findOneAndUpdate(
      { title: req.params.title },
      { prepTime: req.body.prepTime, cookTime: req.body.cookTime },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** ✅ Delete recipe by ID */
app.delete("/recipes/:id", async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** ✅ Local server (for testing) */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

/** ✅ Export app for deployment */
module.exports = app;
