// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('firebase-admin');
const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teams');
const formRoutes = require('./routes/forms');
const responseRoutes = require('./routes/responses');
const { verifyToken } = require('./middleware/authMiddleware');

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({
  origin: "https://dataflow25.vercel.app", 
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization"
}));

app.use(express.json()); 

app.options("*", cors());

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error(err));
