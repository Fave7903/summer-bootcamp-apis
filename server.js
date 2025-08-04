const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const parentRoutes = require('./routes/parent.routes');
const cors = require('cors');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/parents', parentRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
