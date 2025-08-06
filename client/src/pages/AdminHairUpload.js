import React, { useState } from 'react';
import axios from 'axios';

const CLOUD_NAME = 'dda45n7en';
const UPLOAD_PRESET = 'unsigned-preset';

const uploadToCloudinary = async (file) => {
  console.log('Uploading file:', file); // 파일 확인
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', UPLOAD_PRESET);
  console.log('Upload preset:', UPLOAD_PRESET); // preset 확인
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: data,
  });
  const result = await res.json();
  console.log('Cloudinary response:', JSON.stringify(result, null, 2));
  return result.secure_url;
};

const AdminHairUpload = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    tags: '',
    image: null
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      console.log('Form image:', form.image); // 이미지 파일 확인
      const imageUrl = await uploadToCloudinary(form.image);
      console.log('Final imageUrl:', imageUrl); // 최종 URL 확인
      await axios.post(`${process.env.REACT_APP_API_URL}/api/hair-styles`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('헤어스타일 등록 성공!');
    } catch (err) {
      console.error('Error:', err); // 에러 확인
      setMessage('등록 실패: ' + (err.response?.data?.message || '오류'));
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', background: '#fff', padding: 30, borderRadius: 16 }}>
      <h2>헤어스타일 등록 (관리자)</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>설명</label>
          <input name="description" value={form.description} onChange={handleChange} />
        </div>
        <div>
          <label>카테고리</label>
          <input name="category" value={form.category} onChange={handleChange} />
        </div>
        <div>
          <label>태그(쉼표로 구분)</label>
          <input name="tags" value={form.tags} onChange={handleChange} />
        </div>
        <div>
          <label>이미지</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} required />
        </div>
        <button type="submit">등록</button>
      </form>
      {message && <div style={{ marginTop: 20 }}>{message}</div>}
    </div>
  );
};

export default AdminHairUpload; 