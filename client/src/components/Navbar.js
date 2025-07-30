import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaHeart, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { AnimatePresence } from 'framer-motion';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  padding: 0 20px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;

  &:hover {
    color: #667eea;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: #667eea;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #f8f9fa;
    color: #667eea;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const AuthButton = styled(Link)`
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &.login {
    color: #667eea;
    border: 2px solid #667eea;
    background: white;

    &:hover {
      background: #667eea;
      color: white;
    }
  }

  &.register {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: white;
  padding: 20px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (min-width: 769px) {
    display: none;
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✂️ 헤어 합성
          </motion.div>
        </Logo>

        <NavLinks>
          <NavLink to="/">홈</NavLink>
          <NavLink to="/hair-styles">헤어스타일</NavLink>
          {user && (
            <NavLink to="/profile">프로필</NavLink>
          )}
        </NavLinks>

        {user ? (
          <UserMenu>
            <UserButton onClick={() => navigate('/profile')}>
              <FaUser />
              {user.username}
            </UserButton>
            <UserButton onClick={() => navigate('/liked')}>
              <FaHeart />
              좋아요
            </UserButton>
            <UserButton onClick={handleLogout}>
              <FaSignOutAlt />
              로그아웃
            </UserButton>
          </UserMenu>
        ) : (
          <AuthButtons>
            <AuthButton to="/login" className="login">
              로그인
            </AuthButton>
            <AuthButton to="/register" className="register">
              회원가입
            </AuthButton>
          </AuthButtons>
        )}

        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
      </NavContainer>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
              홈
            </NavLink>
            <NavLink to="/hair-styles" onClick={() => setMobileMenuOpen(false)}>
              헤어스타일
            </NavLink>
            {user && (
              <>
                <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  프로필
                </NavLink>
                <UserButton onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                  로그아웃
                </UserButton>
              </>
            )}
            {!user && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <AuthButton to="/login" className="login" onClick={() => setMobileMenuOpen(false)}>
                  로그인
                </AuthButton>
                <AuthButton to="/register" className="register" onClick={() => setMobileMenuOpen(false)}>
                  회원가입
                </AuthButton>
              </div>
            )}
          </MobileMenu>
        )}
      </AnimatePresence>
    </Nav>
  );
};

export default Navbar; 