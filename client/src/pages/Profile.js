import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaCamera, FaSave, FaEdit } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ProfileContainer = styled.div`
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: white;
`;

const ProfileTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
`;

const ProfileSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.8;
`;

const ProfileCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const ProfileSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProfileForm = styled.form`
  display: grid;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: grid;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-weight: 600;
  color: #555;
`;

const FormInput = styled.input`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SaveButton = styled(motion.button)`
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProfileInfo = styled.div`
  display: grid;
  gap: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #555;
`;

const InfoValue = styled.span`
  color: #333;
`;

const SuccessMessage = styled.div`
  color: #27ae60;
  background: #f0f9f4;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #27ae60;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  background: #fdf2f2;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #e74c3c;
`;



const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    profileImage: user?.profileImage || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.put('/api/user/profile', formData);
      setMessage({ type: 'success', text: '프로필이 성공적으로 업데이트되었습니다!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || '프로필 업데이트에 실패했습니다.' 
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>프로필</ProfileTitle>
        <ProfileSubtitle>개인 정보를 관리하세요</ProfileSubtitle>
      </ProfileHeader>

      <ProfileCard
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {message.text && (
          <div className={message.type === 'success' ? 'success' : 'error'}>
            {message.text}
          </div>
        )}

        {isEditing ? (
          <ProfileSection>
            <SectionTitle>
              <FaEdit />
              프로필 편집
            </SectionTitle>
            <ProfileForm onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel>사용자명</FormLabel>
                <FormInput
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>이메일</FormLabel>
                <FormInput
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>프로필 이미지 URL</FormLabel>
                <FormInput
                  type="url"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </FormGroup>

              <div style={{ display: 'flex', gap: '15px' }}>
                <SaveButton
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaSave />
                  {loading ? '저장 중...' : '저장'}
                </SaveButton>
                <SaveButton
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{ background: '#6c757d' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  취소
                </SaveButton>
              </div>
            </ProfileForm>
          </ProfileSection>
        ) : (
          <ProfileSection>
            <SectionTitle>
              <FaUser />
              개인 정보
            </SectionTitle>
            <ProfileInfo>
              <InfoItem>
                <InfoLabel>사용자명</InfoLabel>
                <InfoValue>{user?.username}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>이메일</InfoLabel>
                <InfoValue>{user?.email}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>가입일</InfoLabel>
                <InfoValue>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : '-'}
                </InfoValue>
              </InfoItem>
            </ProfileInfo>
            <SaveButton
              onClick={() => setIsEditing(true)}
              style={{ marginTop: '20px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaEdit />
              프로필 편집
            </SaveButton>
          </ProfileSection>
        )}
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile; 