const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
try { require('dotenv').config(); } catch (e) { /* dotenv không bắt buộc trên Render */ }

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const CLIENT_URL = (process.env.CLIENT_URL || '').replace(/\/+$/, '');

// ---- CORS: chỉ cho phép domain Frontend trong CLIENT_URL (và localhost khi dev) ----
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép request không có Origin (curl, Postman, health check)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS: ' + origin));
  },
}));

app.use(express.json());

// ---- Log mỗi request ----
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// ---- Health check ----
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend dang chay' });
});

// ---- Model Student (strict:false để khớp mọi trường đang có trong Atlas) ----
const Student = mongoose.model(
  'Student',
  new mongoose.Schema({}, { strict: false, timestamps: true })
);

// ---- CRUD /api/students ----
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error('GET /api/students loi:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    console.error('POST /api/students loi:', err.message);
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      strict: false,
    });
    if (!student) return res.status(404).json({ error: 'Khong tim thay sinh vien' });
    res.json(student);
  } catch (err) {
    console.error('PUT /api/students loi:', err.message);
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Khong tim thay sinh vien' });
    res.json({ message: 'Da xoa' });
  } catch (err) {
    console.error('DELETE /api/students loi:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// ---- Kết nối MongoDB rồi mới mở server ----
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Ket noi MongoDB Atlas thanh cong!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Loi ket noi MongoDB:', err.message);
    process.exit(1);
  });