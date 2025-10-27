const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db/db.connect');
const Recipe = require('./models/recipe.model');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ CREATE a new recipe
app.post('/api/recipes', async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json({ success: true, data: recipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ GET all recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json({ success: true, count: recipes.length, data: recipes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ GET recipe by title
app.get('/api/recipes/title/:title', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ title: req.params.title });
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });
    res.status(200).json({ success: true, data: recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ GET recipes by author
app.get('/api/recipes/author/:author', async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.params.author });
    if (!recipes.length) return res.status(404).json({ success: false, message: 'No recipes found for this author' });
    res.status(200).json({ success: true, count: recipes.length, data: recipes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ GET recipes by difficulty
app.get('/api/recipes/difficulty/:difficulty', async (req, res) => {
  try {
    const recipes = await Recipe.find({ difficulty: req.params.difficulty });
    if (!recipes.length) return res.status(404).json({ success: false, message: 'No recipes found for this difficulty level' });
    res.status(200).json({ success: true, count: recipes.length, data: recipes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ UPDATE difficulty by ID
app.put('/api/recipes/:id/difficulty', async (req, res) => {
  try {
    const { difficulty } = req.body;
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, { difficulty }, { new: true, runValidators: true });
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });
    res.status(200).json({ success: true, data: recipe });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ✅ UPDATE prep and cook time by title
app.put('/api/recipes/title/:title/times', async (req, res) => {
  try {
    const { prepTime, cookTime } = req.body;
    const recipe = await Recipe.findOneAndUpdate(
      { title: req.params.title },
      { prepTime, cookTime },
      { new: true, runValidators: true }
    );
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });
    res.status(200).json({ success: true, data: { prepTime: recipe.prepTime, cookTime: recipe.cookTime } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ✅ DELETE recipe by ID
app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });
    res.status(200).json({ success: true, message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Health check
app.get('/api/health', (req, res) => res.status(200).json({ status: 'OK' }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));