
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { useWordPressAuth } from '@/contexts/WordPressAuthContext';

export const Auth = () => {
  const { isAuthenticated } = useWordPressAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm onSwitchToRegister={() => {}} />
      </div>
    </div>
  );
};
