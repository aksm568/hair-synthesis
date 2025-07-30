# 헤어 합성 웹사이트 ✂️

AI 기술을 활용한 헤어스타일 시뮬레이션 웹사이트입니다. 사용자가 자신의 얼굴 사진을 업로드하고 다양한 헤어스타일을 미리 확인할 수 있습니다.

## 주요 기능

- **사진 업로드**: 자신의 얼굴 사진을 업로드
- **헤어스타일 갤러리**: 다양한 헤어스타일 선택
- **AI 합성**: 선택한 헤어스타일을 얼굴에 합성
- **조정 기능**: 위치, 크기, 회전, 투명도 조정
- **로그인/회원가입**: 사용자 계정 관리
- **좋아요 기능**: 마음에 드는 합성 결과 저장
- **반응형 디자인**: 모바일과 데스크톱 모두 지원

## 기술 스택

### Frontend
- React 18
- React Router DOM
- Styled Components
- Framer Motion
- Axios
- React Dropzone
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT 인증
- Multer (파일 업로드)
- bcryptjs (비밀번호 해싱)

## 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd hair-synthesis-website
```

### 2. 의존성 설치
```bash
# 전체 프로젝트 의존성 설치
npm run install-all

# 또는 개별 설치
npm install
cd server && npm install
cd ../client && npm install
```

### 3. 환경 설정
```bash
# 서버 디렉토리로 이동
cd server

# 환경 변수 파일 생성
cp env.example .env

# .env 파일을 편집하여 설정 변경
```

### 4. MongoDB 설정
MongoDB가 설치되어 있어야 합니다. 로컬 MongoDB 또는 MongoDB Atlas를 사용할 수 있습니다.

### 5. 개발 서버 실행
```bash
# 루트 디렉토리에서
npm run dev

# 또는 개별 실행
npm run server  # 백엔드 서버 (포트 5000)
npm run client  # 프론트엔드 서버 (포트 3000)
```

## 프로젝트 구조

```
hair-synthesis-website/
├── client/                 # React 프론트엔드
│   ├── public/
│   ├── src/
│   │   ├── components/    # 재사용 가능한 컴포넌트
│   │   ├── contexts/      # React Context
│   │   ├── pages/         # 페이지 컴포넌트
│   │   └── App.js
│   └── package.json
├── server/                 # Node.js 백엔드
│   ├── models/            # MongoDB 모델
│   ├── routes/            # API 라우트
│   ├── middleware/        # 미들웨어
│   ├── uploads/           # 업로드된 파일
│   └── index.js
└── package.json
```

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 사용자
- `GET /api/user/liked-syntheses` - 좋아요한 합성 목록
- `POST /api/user/toggle-like/:id` - 좋아요 토글
- `PUT /api/user/profile` - 프로필 업데이트

### 헤어스타일
- `GET /api/hair-styles` - 헤어스타일 목록
- `GET /api/hair-styles/:id` - 특정 헤어스타일
- `GET /api/hair-styles/category/:category` - 카테고리별 헤어스타일

### 합성
- `POST /api/synthesis` - 합성 생성
- `GET /api/synthesis` - 합성 목록
- `GET /api/synthesis/:id` - 특정 합성
- `PUT /api/synthesis/:id` - 합성 업데이트
- `DELETE /api/synthesis/:id` - 합성 삭제

## 환경 변수

### 서버 (.env)
```
MONGODB_URI=mongodb://localhost:27017/hair-synthesis
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

## 배포

### 개발 환경
```bash
npm run dev
```

### 프로덕션 환경
```bash
# 클라이언트 빌드
cd client && npm run build

# 서버 실행
cd server && npm start
```

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**참고**: 이 프로젝트는 교육 및 포트폴리오 목적으로 제작되었습니다. 실제 AI 헤어 합성 기능은 더 복잡한 머신러닝 모델이 필요할 수 있습니다. 