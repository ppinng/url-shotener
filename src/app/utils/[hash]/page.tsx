'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Loader = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #4a90e2;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const Message = styled.p`
  color: #666;
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin-top: 1rem;
`;

const BackButton = styled.a`
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  background-color: #4a90e2;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #357abD;
  }
`;

export default function RedirectPage() {
  const params = useParams();
  const [error, setError] = useState<string | null>(null);
  const hash = params.hash as string;

  useEffect(() => {
    if (!hash) return;

    const redirectUrl = localStorage.getItem(hash);
    
    if (redirectUrl) {
      // Add a small delay to show the redirect page
      const redirectTimer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);
      
      return () => clearTimeout(redirectTimer);
    } else {
      setError('URL not found. It may have expired or been removed.');
    }
  }, [hash]);

  return (
    <Container>
      {!error ? (
        <>
          <Loader />
          <Title>Redirecting you...</Title>
          <Message>Please wait a moment</Message>
        </>
      ) : (
        <>
          <Title>Oops! Link Not Found</Title>
          <ErrorMessage>{error}</ErrorMessage>
          <BackButton href="/">Back to Homepage</BackButton>
        </>
      )}
    </Container>
  );
}