const express = require('express');
const HairStyle = require('../models/HairStyle');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// 이미지 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 모든 헤어스타일 가져오기
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const hairStyles = await HairStyle.find(query).sort({ createdAt: -1 });
    res.json(hairStyles);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 특정 헤어스타일 가져오기
router.get('/:id', async (req, res) => {
  try {
    const hairStyle = await HairStyle.findById(req.params.id);
    if (!hairStyle) {
      return res.status(404).json({ message: '헤어스타일을 찾을 수 없습니다' });
    }
    res.json(hairStyle);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 카테고리별 헤어스타일 가져오기
router.get('/category/:category', async (req, res) => {
  try {
    const hairStyles = await HairStyle.find({ 
      category: req.params.category, 
      isActive: true 
    }).sort({ createdAt: -1 });
    res.json(hairStyles);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 헤어스타일 등록 (관리자용)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, tags } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const hairStyle = new HairStyle({
      name,
      description,
      category,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      imageUrl
    });
    await hairStyle.save();
    res.status(201).json({ message: '헤어스타일 등록 완료', hairStyle });
  } catch (error) {
    res.status(500).json({ message: '등록 실패', error });
  }
});

module.exports = router; 