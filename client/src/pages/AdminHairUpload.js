import React, { useState } from 'react';
import axios from 'axios';

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
    const data = new FormData();
    data.append('name', form.name);
    data.append('description', form.description);
    data.append('category', form.category);
    data.append('tags', form.tags);
    data.append('image', form.image);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/hair-styles`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('헤어스타일 등록 성공!');
    } catch (err) {
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