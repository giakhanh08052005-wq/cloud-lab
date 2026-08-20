const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware bắt buộc
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Ket noi MongoDB Atlas thanh cong!"))
  .catch((err) => console.error("Loi ket noi MongoDB:", err));

// Route API Sinh viên
const studentRoutes = require('./routes/studentRoutes');
app.use('/api/students', studentRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: "Backend Node.js & Express dang hoat dong thanh cong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server dang chay tai port ${PORT}`);
});