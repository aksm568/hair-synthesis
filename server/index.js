const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const hairStyleRoutes = require('./routes/hairStyle');
const synthesisRoutes = require('./routes/synthesis');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙
app.use('/uploads', express.static('uploads'));

// 이미지 프록시 엔드포인트 (CORS 문제 해결)
app.get('/api/proxy-image/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, 'uploads', filename);
  
  if (fs.existsSync(imagePath)) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ message: '이미지를 찾을 수 없습니다' });
  }
});

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hair-synthesis', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB 연결 성공'))
.catch(err => console.error('MongoDB 연결 실패:', err));

// 라우트
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/hair-styles', hairStyleRoutes);
app.use('/api/synthesis', synthesisRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: '헤어 합성 API 서버가 실행 중입니다!' });
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
}); 