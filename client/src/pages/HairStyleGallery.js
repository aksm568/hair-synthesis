import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const GalleryContainer = styled.div`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const GalleryHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const GalleryTitle = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 10px;
`;

const GallerySubtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
`;

const SearchFilterContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  justify-content: center;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 20px;
  padding-left: 50px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const FilterButton = styled.button`
  padding: 15px 25px;
  border: none;
  border-radius: 25px;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const HairStylesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
`;

const HairStyleCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const HairStyleImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const HairStyleInfo = styled.div`
  padding: 20px;
`;

const HairStyleName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
`;

const HairStyleCategory = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const HairStyleDescription = styled.p`
  color: #666;
  margin-top: 10px;
  line-height: 1.5;
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

const NoResults = styled.div`
  text-align: center;
  color: white;
  padding: 40px;
  font-size: 1.2rem;
`;

const categories = [
  { id: 'all', name: '전체' },
  { id: '단발', name: '단발' },
  { id: '레이어드', name: '레이어드' },
  { id: '펌', name: '펌' },
  { id: '염색', name: '염색' },
  { id: '업스타일', name: '업스타일' },
  { id: '기타', name: '기타' }
];

const HairStyleGallery = () => {
  const [hairStyles, setHairStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHairStyles();
  }, []);

  const fetchHairStyles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/hair-styles');
      setHairStyles(response.data);
    } catch (err) {
      setError('헤어스타일을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredHairStyles = hairStyles.filter(style => {
    const matchesSearch = style.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         style.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || style.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleHairStyleClick = (hairStyleId) => {
    navigate(`/synthesis/${hairStyleId}`);
  };

  if (loading) {
    return (
      <GalleryContainer>
        <LoadingContainer>헤어스타일을 불러오는 중...</LoadingContainer>
      </GalleryContainer>
    );
  }

  if (error) {
    return (
      <GalleryContainer>
        <ErrorContainer>
          <h2>오류가 발생했습니다</h2>
          <p>{error}</p>
        </ErrorContainer>
      </GalleryContainer>
    );
  }

  return (
    <GalleryContainer>
      <GalleryHeader>
        <GalleryTitle>헤어스타일 갤러리</GalleryTitle>
        <GallerySubtitle>
          다양한 헤어스타일을 선택하여 AI 합성을 시도해보세요
        </GallerySubtitle>
      </GalleryHeader>

      <SearchFilterContainer>
        <SearchBox>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="헤어스타일 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <FilterButton
              key={category.id}
              active={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </FilterButton>
          ))}
        </div>
      </SearchFilterContainer>

      {filteredHairStyles.length === 0 ? (
        <NoResults>
          {searchTerm || selectedCategory !== 'all' 
            ? '검색 결과가 없습니다.' 
            : '헤어스타일이 없습니다.'}
        </NoResults>
      ) : (
        <HairStylesGrid>
          {filteredHairStyles.map((hairStyle, index) => (
            <HairStyleCard
              key={hairStyle._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleHairStyleClick(hairStyle._id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <HairStyleImage src={hairStyle.imageUrl} alt={hairStyle.name} />
              <HairStyleInfo>
                <HairStyleName>{hairStyle.name}</HairStyleName>
                <HairStyleCategory>{hairStyle.category}</HairStyleCategory>
                {hairStyle.description && (
                  <HairStyleDescription>{hairStyle.description}</HairStyleDescription>
                )}
              </HairStyleInfo>
            </HairStyleCard>
          ))}
        </HairStylesGrid>
      )}
    </GalleryContainer>
  );
};

export default HairStyleGallery; 