import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHeart, FaEye, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const LikedContainer = styled.div`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const LikedHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: white;
`;

const LikedTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
`;

const LikedSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.8;
`;

const SynthesesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

const SynthesisCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const SynthesisImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const SynthesisInfo = styled.div`
  padding: 20px;
`;

const SynthesisHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const SynthesisTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin: 0;
`;

const SynthesisActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &.like {
    color: #e74c3c;
    background: rgba(231, 76, 60, 0.1);

    &:hover {
      background: rgba(231, 76, 60, 0.2);
      transform: scale(1.1);
    }
  }

  &.view {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);

    &:hover {
      background: rgba(102, 126, 234, 0.2);
      transform: scale(1.1);
    }
  }


`;

const SynthesisDetails = styled.div`
  display: grid;
  gap: 8px;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #666;
`;

const DetailLabel = styled.span`
  font-weight: 600;
`;

const DetailValue = styled.span``;

const HairStyleTag = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const EmptyState = styled.div`
  text-align: center;
  color: white;
  padding: 60px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  opacity: 0.8;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: white;
  font-size: 1.2rem;
`;

const ErrorContainer = styled.div`
  text-align: center;
  color: white;
  padding: 40px;
`;

// 모달 관련 스타일 컴포넌트들
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  color: #333;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const LikedSyntheses = () => {
  const [likedSyntheses, setLikedSyntheses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSynthesis, setSelectedSynthesis] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchLikedSyntheses();
  }, []);

  const fetchLikedSyntheses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/synthesis/liked`);
      setLikedSyntheses(response.data);
    } catch (err) {
      setError('좋아요한 합성을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (synthesisId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('인증 토큰이 없습니다. 다시 로그인해주세요.');
        return;
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/api/synthesis/${synthesisId}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // 좋아요 목록에서 제거
      setLikedSyntheses(prev => 
        prev.filter(synthesis => synthesis._id !== synthesisId)
      );
    } catch (error) {
      console.error('좋아요 취소에 실패했습니다:', error);
      if (error.response?.status === 401) {
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
      } else {
        alert('좋아요 취소 중 오류가 발생했습니다.');
      }
    }
  };



  const handleView = (synthesis) => {
    setSelectedSynthesis(synthesis);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSynthesis(null);
  };

  if (loading) {
    return (
      <LikedContainer>
        <LoadingContainer>좋아요한 합성을 불러오는 중...</LoadingContainer>
      </LikedContainer>
    );
  }

  if (error) {
    return (
      <LikedContainer>
        <ErrorContainer>
          <h2>오류가 발생했습니다</h2>
          <p>{error}</p>
        </ErrorContainer>
      </LikedContainer>
    );
  }

  return (
    <LikedContainer>
      <LikedHeader>
        <LikedTitle>좋아요한 합성</LikedTitle>
        <LikedSubtitle>
          마음에 드는 헤어 합성 결과를 모아보세요
        </LikedSubtitle>
      </LikedHeader>

      {likedSyntheses.length === 0 ? (
        <EmptyState>
          <EmptyIcon>💔</EmptyIcon>
          <EmptyTitle>좋아요한 합성이 없습니다</EmptyTitle>
          <EmptyText>
            헤어스타일 갤러리에서 마음에 드는 스타일을 찾아 합성해보세요!
          </EmptyText>
        </EmptyState>
      ) : (
        <SynthesesGrid>
          {likedSyntheses.map((synthesis, index) => (
            <SynthesisCard
              key={synthesis._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <SynthesisImage 
                src={synthesis.synthesizedImage} 
                alt="합성 결과" 
              />
              <SynthesisInfo>
                <SynthesisHeader>
                  <SynthesisTitle>
                    {synthesis.hairStyle?.name || '헤어스타일'}
                  </SynthesisTitle>
                  <SynthesisActions>
                    <ActionButton
                      className="view"
                      onClick={() => handleView(synthesis)}
                      title="상세 보기"
                    >
                      <FaEye />
                    </ActionButton>
                    <ActionButton
                      className="like"
                      onClick={() => handleToggleLike(synthesis._id)}
                      title="좋아요 취소"
                    >
                      <FaHeart />
                    </ActionButton>
                  </SynthesisActions>
                </SynthesisHeader>

                <SynthesisDetails>
                  <DetailItem>
                    <DetailLabel>헤어스타일:</DetailLabel>
                    <HairStyleTag>
                      {synthesis.hairStyle?.category || '기타'}
                    </HairStyleTag>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>작성자:</DetailLabel>
                    <DetailValue>
                      {synthesis.user?.username || '알 수 없음'}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>생성일:</DetailLabel>
                    <DetailValue>
                      {new Date(synthesis.createdAt).toLocaleDateString('ko-KR')}
                    </DetailValue>
                  </DetailItem>
                </SynthesisDetails>
              </SynthesisInfo>
            </SynthesisCard>
          ))}
        </SynthesesGrid>
      )}

      {/* 모달 */}
      {isModalOpen && selectedSynthesis && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
        >
          <ModalContent
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalCloseButton onClick={handleCloseModal}>
              <FaTimes />
            </ModalCloseButton>
            <ModalImage 
              src={selectedSynthesis.synthesizedImage} 
              alt="합성 결과 상세보기" 
            />
          </ModalContent>
        </ModalOverlay>
      )}
    </LikedContainer>
  );
};

export default LikedSyntheses; 