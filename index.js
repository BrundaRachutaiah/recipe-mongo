const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db/db.connect");
const Recipe = require("./models/recipe.model");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Test route
app.get("/", (req, res) => {
  res.status(200).json({ message: "🍽️ Recipe API running successfully!" });
});

// 3. CREATE Recipe
app.post("/recipes", async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 6. GET All Recipes
app.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 7. GET Recipe by Title
app.get("/recipes/title/:title", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ title: req.params.title });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 8. GET All Recipes by Author
app.get("/recipes/author/:author", async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.params.author });

    if (!recipes.length) {
      return res.status(404).json({ message: "No recipes found" });
    }

    res.status(200).json(recipes);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 9. GET All Easy Recipes
app.get("/recipes/difficulty/easy", async (req, res) => {
  try {
    const recipes = await Recipe.find({ difficulty: "Easy" });

    if (!recipes.length) {
      return res.status(404).json({ message: "No recipes found" });
    }

    res.status(200).json(recipes);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 10. Update Recipe Difficulty by ID
app.put("/recipes/:id/difficulty", async (req, res) => {
  try {
    const { difficulty } = req.body;

    if (!difficulty || !["Easy", "Intermediate", "Difficult"].includes(difficulty)) {
      return res.status(400).json({ message: "Invalid difficulty value" });
    }

    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      { difficulty },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(updated);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 11. Update Prep & Cook Time by Title
app.put("/recipes/title/:title/time", async (req, res) => {
  try {
    const { prepTime, cookTime } = req.body;

    const updated = await Recipe.findOneAndUpdate(
      { title: req.params.title },
      { prepTime, cookTime },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(updated);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 12. DELETE Recipe by ID
app.delete("/recipes/:id", async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;