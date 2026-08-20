const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// API GET: Lấy danh sách sinh viên
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API POST: Thêm sinh viên mới
router.post('/', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;
    const newStudent = await Student.create({ studentId, name, email });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;