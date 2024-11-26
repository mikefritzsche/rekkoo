const express = require('express');
// const userRoutes = require('./routes/user.routes');

const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.json());

// Routes
// app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.get('/', (req, res) => {
  res.json({status: 200, message: 'Default GET route'})
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
