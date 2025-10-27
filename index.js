import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Recipe from "./models/recipe.model.js";

dotenv.config();
const app = express();
app.use(express.json());

/** ✅ Persistent MongoDB Connection for Vercel **/
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("✅ MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw new Error("Database connection failed");
  }
}

/** ✅ Root route **/
app.get("/", (req, res) => {
  res.status(200).json({ message: "🍽️ Recipe API running successfully!" });
});

/** ✅ Create new recipe **/
app.post("/recipes", async (req, res) => {
  try {
    await connectDB();
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** ✅ Get all recipes **/
app.get("/recipes", async (req, res) => {
  try {
    await connectDB();
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** ✅ Get recipe by title **/
app.get("/recipes/title/:title", async (req, res) => {
  try {
    await connectDB();
    const recipe = await Recipe.findOne({ title: req.params.title });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** ✅ Get recipes by author **/
app.get("/recipes/author/:author", async (req, res) => {
  try {
    await connectDB();
    const recipes = await Recipe.find({ author: req.params.author });
    if (!recipes.length)
      return res.status(404).json({ message: "No recipes found" });
    res.status(200).json(recipes);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** ✅ Get easy recipes **/
app.get("/recipes/difficulty/easy", async (req, res) => {
  try {
    await connectDB();
    const recipes = await Recipe.find({ difficulty: "Easy" });
    res.status(200).json(recipes);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** ✅ Update difficulty by ID **/
app.put("/recipes/:id/difficulty", async (req, res) => {
  try {
    await connectDB();
    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      { difficulty: req.body.difficulty },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(updated);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** ✅ Update time by title **/
app.put("/recipes/title/:title/time", async (req, res) => {
  try {
    await connectDB();
    const updated = await Recipe.findOneAndUpdate(
      { title: req.params.title },
      { prepTime: req.body.prepTime, cookTime: req.body.cookTime },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(updated);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** ✅ Delete recipe **/
app.delete("/recipes/:id", async (req, res) => {
  try {
    await connectDB();
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** ✅ Local server for testing **/
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
