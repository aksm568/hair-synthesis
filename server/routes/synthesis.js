const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Synthesis = require('../models/Synthesis');
const HairStyle = require('../models/HairStyle');

const router = express.Router();

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다'), false);
    }
  }
});

// 합성 생성
router.post('/', auth, upload.single('originalImage'), async (req, res) => {
  try {
    const { hairStyleId, adjustments } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: '이미지를 업로드해주세요' });
    }

    const hairStyle = await HairStyle.findById(hairStyleId);
    if (!hairStyle) {
      return res.status(404).json({ message: '헤어스타일을 찾을 수 없습니다' });
    }

    // 실제 합성 로직은 여기에 구현
    // 현재는 원본 이미지와 헤어스타일 정보만 저장
    const synthesis = new Synthesis({
      user: req.user._id,
      originalImage: `/uploads/${req.file.filename}`,
      hairStyle: hairStyleId,
      synthesizedImage: `/uploads/${req.file.filename}`, // 실제로는 합성된 이미지
      adjustments: adjustments ? JSON.parse(adjustments) : {
        position: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
        rotation: 0,
        opacity: 1
      }
    });

    await synthesis.save();

    res.status(201).json({
      message: '합성이 완료되었습니다',
      synthesis
    });
  } catch (error) {
    console.error('내 합성 결과 조회 에러:', error); // 이 줄 추가!
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 합성 목록 가져오기
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const syntheses = await Synthesis.find({ isPublic: true })
      .populate('user', 'username')
      .populate('hairStyle', 'name imageUrl category')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Synthesis.countDocuments({ isPublic: true });

    res.json({
      syntheses,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 좋아요한 합성 목록 조회
router.get('/liked', auth, async (req, res) => {
  try {
    const syntheses = await Synthesis.find({ likes: req.user._id })
      .populate('hairStyle', 'name imageUrl category')
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    
    const result = syntheses.map(s => ({
      ...s.toObject(),
      isLiked: true
    }));
    
    res.json(result);
  } catch (error) {
    console.error('좋아요한 합성 조회 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 특정 합성 가져오기
router.get('/:id', async (req, res) => {
  try {
    const synthesis = await Synthesis.findById(req.params.id)
      .populate('user', 'username')
      .populate('hairStyle', 'name imageUrl category');

    if (!synthesis) {
      return res.status(404).json({ message: '합성을 찾을 수 없습니다' });
    }

    res.json(synthesis);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 합성 업데이트 (조정값)
router.put('/:id', auth, async (req, res) => {
  try {
    const { adjustments } = req.body;
    const synthesis = await Synthesis.findById(req.params.id);

    if (!synthesis) {
      return res.status(404).json({ message: '합성을 찾을 수 없습니다' });
    }

    if (synthesis.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }

    synthesis.adjustments = adjustments;
    await synthesis.save();

    res.json({
      message: '합성이 업데이트되었습니다',
      synthesis
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 합성 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const synthesis = await Synthesis.findById(req.params.id);

    if (!synthesis) {
      return res.status(404).json({ message: '합성을 찾을 수 없습니다' });
    }

    if (synthesis.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }

    await synthesis.remove();

    res.json({ message: '합성이 삭제되었습니다' });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 내가 만든 합성 결과만 조회
router.get('/my', auth, async (req, res) => {
  try {
    const syntheses = await Synthesis.find({ user: req.user._id })
      .populate('hairStyle', 'name imageUrl category')
      .sort({ createdAt: -1 });
    // 각 합성 결과에 isLiked 필드 추가
    const result = syntheses.map(s => ({
      ...s.toObject(),
      isLiked: s.likes && s.likes.some(u => u.toString() === req.user._id.toString())
    }));
    res.json(result);
  } catch (error) {
    console.error('내 합성 결과 조회 에러:', error); // 추가!
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 좋아요 토글
router.post('/:id/like', auth, async (req, res) => {
  try {
    const synthesis = await Synthesis.findById(req.params.id);
    
    if (!synthesis) {
      return res.status(404).json({ message: '합성을 찾을 수 없습니다' });
    }

    const userLiked = synthesis.likes.some(like => like.toString() === req.user._id.toString());
    
    if (userLiked) {
      // 좋아요 취소
      synthesis.likes = synthesis.likes.filter(like => like.toString() !== req.user._id.toString());
    } else {
      // 좋아요 추가
      synthesis.likes.push(req.user._id);
    }
    
    await synthesis.save();
    
    res.json({ 
      message: userLiked ? '좋아요가 취소되었습니다' : '좋아요가 추가되었습니다',
      isLiked: !userLiked
    });
  } catch (error) {
    console.error('좋아요 토글 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

module.exports = router; 