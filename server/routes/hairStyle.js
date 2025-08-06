const express = require('express');
const HairStyle = require('../models/HairStyle');

const router = express.Router();

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
    
    // 이미지 URL을 프록시 URL로 변환 (CORS 문제 해결)
    const hairStylesWithFullUrls = hairStyles.map(style => ({
      ...style.toObject(),
      imageUrl: style.imageUrl ? `${req.protocol}://${req.get('host')}/api/proxy-image/${style.imageUrl.split('/').pop()}` : style.imageUrl
    }));
    
    res.json(hairStylesWithFullUrls);
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
    
    // 이미지 URL을 프록시 URL로 변환 (CORS 문제 해결)
    const hairStyleWithFullUrl = {
      ...hairStyle.toObject(),
      imageUrl: hairStyle.imageUrl ? `${req.protocol}://${req.get('host')}/api/proxy-image/${hairStyle.imageUrl.split('/').pop()}` : hairStyle.imageUrl
    };
    
    res.json(hairStyleWithFullUrl);
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
    
    // 이미지 URL을 프록시 URL로 변환 (CORS 문제 해결)
    const hairStylesWithFullUrls = hairStyles.map(style => ({
      ...style.toObject(),
      imageUrl: style.imageUrl ? `${req.protocol}://${req.get('host')}/api/proxy-image/${style.imageUrl.split('/').pop()}` : style.imageUrl
    }));
    
    res.json(hairStylesWithFullUrls);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 헤어스타일 등록 (Cloudinary URL만 저장)
router.post('/', async (req, res) => {
  try {
    const { name, description, category, tags, imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: '이미지 URL이 필요합니다' });
    }
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