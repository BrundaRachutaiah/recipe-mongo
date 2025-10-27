import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Recipe from "./models/recipe.model.js";

dotenv.config();
const app = express();
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🍽️ Recipe API is running!");
});


// ✅ (3) Create a new recipe
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


// ✅ (6) Get all recipes
app.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ✅ (7) Get recipe by title
app.get("/recipes/title/:title", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ title: req.params.title });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (error) {
    console.error("Error fetching recipe by title:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ✅ (8) Get all recipes by author
app.get("/recipes/author/:author", async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.params.author });
    if (recipes.length === 0)
      return res.status(404).json({ message: "No recipes found for this author" });
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes by author:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ✅ (9) Get all "Easy" difficulty recipes
app.get("/recipes/difficulty/easy", async (req, res) => {
  try {
    const recipes = await Recipe.find({ difficulty: "Easy" });
    if (recipes.length === 0)
      return res.status(404).json({ message: "No easy recipes found" });
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching easy recipes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ✅ (10) Update recipe difficulty by ID
app.put("/recipes/:id/difficulty", async (req, res) => {
  try {
    const { difficulty } = req.body;
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { difficulty },
      { new: true }
    );
    if (!updatedRecipe)
      return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error("Error updating difficulty:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ✅ (11) Update prepTime and cookTime by title
app.put("/recipes/title/:title/time", async (req, res) => {
  try {
    const { prepTime, cookTime } = req.body;
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { title: req.params.title },
      { prepTime, cookTime },
      { new: true }
    );
    if (!updatedRecipe)
      return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe time:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ✅ (12) Delete recipe by ID
app.delete("/recipes/:id", async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ✅ Start Server (for local run)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app; // Needed for Vercel
