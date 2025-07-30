import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCamera, FaHeart, FaUsers, FaMagic } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Hero = styled.section`
  text-align: center;
  padding: 80px 20px;
  color: white;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  margin-bottom: 40px;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled(motion(Link))`
  display: inline-block;
  padding: 16px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: bold;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  }
`;

const Features = styled.section`
  padding: 80px 20px;
  background: white;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FeaturesTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 60px;
  color: #333;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
`;

const FeatureCard = styled(motion.div)`
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  color: #667eea;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const HowItWorks = styled.section`
  padding: 80px 20px;
  background: #f8f9fa;
`;

const HowItWorksContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HowItWorksTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 60px;
  color: #333;
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
`;

const Step = styled(motion.div)`
  text-align: center;
  padding: 30px 20px;
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 20px;
`;

const StepTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #333;
`;

const StepDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <FaCamera />,
      title: '사진 업로드',
      description: '자신의 얼굴 사진을 업로드하여 다양한 헤어스타일을 시도해보세요.'
    },
    {
      icon: <FaMagic />,
      title: 'AI 합성',
      description: '최신 AI 기술을 활용하여 자연스러운 헤어 합성을 제공합니다.'
    },
    {
      icon: <FaHeart />,
      title: '좋아요 기능',
      description: '마음에 드는 헤어스타일을 좋아요하고 나중에 다시 볼 수 있습니다.'
    },
    {
      icon: <FaUsers />,
      title: '커뮤니티',
      description: '다른 사용자들의 합성 결과를 확인하고 영감을 얻어보세요.'
    }
  ];

  const steps = [
    {
      number: '1',
      title: '사진 업로드',
      description: '자신의 얼굴이 잘 보이는 사진을 업로드하세요.'
    },
    {
      number: '2',
      title: '헤어스타일 선택',
      description: '다양한 헤어스타일 중에서 원하는 스타일을 선택하세요.'
    },
    {
      number: '3',
      title: '합성 및 조정',
      description: 'AI가 자동으로 합성한 후 위치와 크기를 조정할 수 있습니다.'
    },
    {
      number: '4',
      title: '결과 저장',
      description: '만족스러운 결과를 저장하고 공유해보세요.'
    }
  ];

  return (
    <HomeContainer>
      <Hero>
        <HeroTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          AI 헤어 합성으로
          <br />
          새로운 스타일을 발견하세요
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          최신 AI 기술을 활용하여 실제로 머리를 자르지 않고도 다양한 헤어스타일을 미리 확인할 수 있습니다.
        </HeroSubtitle>
        <CTAButton
          to={user ? '/hair-styles' : '/register'}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {user ? '헤어스타일 보기' : '지금 시작하기'}
        </CTAButton>
      </Hero>

      <HowItWorks>
        <HowItWorksContainer>
          <HowItWorksTitle>사용 방법</HowItWorksTitle>
          <StepsContainer>
            {steps.map((step, index) => (
              <Step
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <StepNumber>{step.number}</StepNumber>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Step>
            ))}
          </StepsContainer>
        </HowItWorksContainer>
      </HowItWorks>
    </HomeContainer>
  );
};

export default Home; 