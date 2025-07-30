const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Synthesis = require('../models/Synthesis');

const router = express.Router();

// 좋아요한 합성 목록 가져오기
router.get('/liked-syntheses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'likedSyntheses',
        populate: [
          { path: 'hairStyle', select: 'name imageUrl category' },
          { path: 'user', select: 'username' }
        ]
      });

    res.json(user.likedSyntheses);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 합성 좋아요/좋아요 취소
router.post('/toggle-like/:synthesisId', auth, async (req, res) => {
  try {
    const { synthesisId } = req.params;
    const user = await User.findById(req.user._id);
    const synthesis = await Synthesis.findById(synthesisId);

    if (!synthesis) {
      return res.status(404).json({ message: '합성을 찾을 수 없습니다' });
    }

    const likedIndex = user.likedSyntheses.indexOf(synthesisId);
    const synthesisLikedIndex = synthesis.likes.indexOf(req.user._id);

    if (likedIndex === -1) {
      // 좋아요 추가
      user.likedSyntheses.push(synthesisId);
      synthesis.likes.push(req.user._id);
    } else {
      // 좋아요 취소
      user.likedSyntheses.splice(likedIndex, 1);
      synthesis.likes.splice(synthesisLikedIndex, 1);
    }

    await user.save();
    await synthesis.save();

    res.json({ 
      message: likedIndex === -1 ? '좋아요가 추가되었습니다' : '좋아요가 취소되었습니다',
      isLiked: likedIndex === -1
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 사용자 프로필 업데이트
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, profileImage } = req.body;
    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.json({
      message: '프로필이 업데이트되었습니다',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

module.exports = router; 