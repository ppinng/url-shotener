'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { FiCopy, FiArrowRight } from 'react-icons/fi';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Button = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #357abD;
  }
  
  &:active {
    animation: ${pulse} 0.3s ease;
  }
`;

const ResultContainer = styled.div`
  margin-top: 2rem;
  animation: ${fadeIn} 0.5s ease;
`;

const ResultTitle = styled.h3`
  margin-bottom: 0.5rem;
  color: #333;
`;

const ResultBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f7fa;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
`;

const ShortUrl = styled.a`
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #4a90e2;
  }
`;

const Footer = styled.footer`
  margin-top: 2rem;
  text-align: center;
  color: #666;
  font-size: 0.875rem;
`;

const ToastMessage = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  animation: ${fadeIn} 0.3s ease;
`;

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const generateShortUrl = (longUrl: string) => {
    // Simple hash function to convert URL to a short string
    let hash = 0;
    if (longUrl.length === 0) return hash.toString(36);
    
    for (let i = 0; i < longUrl.length; i++) {
      const char = longUrl.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Get positive value and convert to base36 (alphanumeric)
    const positiveHash = Math.abs(hash);
    return positiveHash.toString(36).substring(0, 6);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) return;
    
    try {
      new URL(url); // Check if URL is valid
      
      const hash = generateShortUrl(url);
      
      // Create the actual short URL using current domain with the new 'untils' path
      const baseUrl = window.location.origin;
      const fullShortUrl = `${baseUrl}/utils/${hash}`;
      
      // For frontend-only version, store the mapping in localStorage
      localStorage.setItem(hash, url);
      setShortUrl(fullShortUrl);
    } catch (err) {
      alert('Please enter a valid URL');
    }
  };

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setShowToast(true);
      
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
  };

  return (
    <Container>
      <Card>
        <Title>URL Shortener</Title>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="text"
              placeholder="Enter your long URL here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button type="submit">
              Shorten
              <FiArrowRight />
            </Button>
          </InputGroup>
        </Form>

        {shortUrl && (
          <ResultContainer>
            <ResultTitle>Your shortened URL:</ResultTitle>
            <ResultBox>
              <ShortUrl href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </ShortUrl>
              <CopyButton onClick={copyToClipboard}>
                <FiCopy size={18} />
              </CopyButton>
            </ResultBox>
          </ResultContainer>
        )}
      </Card>

      <Footer>
        &copy; {new Date().getFullYear()} ppinng
      </Footer>

      {showToast && (
        <ToastMessage>
          URL copied to clipboard!
        </ToastMessage>
      )}
    </Container>
  );
}