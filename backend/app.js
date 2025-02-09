const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const authmiddleware = require('./middleware/authmiddleware');
const bodyParser = require('body-parser');
const mpesaRoutes = require('./routes/mpesaRoutes');

const app = express();
app.use(express.json());


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Database connected'))
.catch((err) => console.error('Database connection error:', err));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', authMiddleware.isAuthenticated, profileRoutes);
app.use('/mpesa', mpesaRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});