'use client';
import React, { useState } from 'react';
import StripeCheckout from './StripeCheckout';
import AuthModal from '../Auth/AuthModal';
import { isAuthenticated } from '@/lib/auth';

interface StripeCheckoutWithAuthProps {
  plan?: 'premium' | 'pro';
  buttonText?: string;
  className?: string;
  style?: React.CSSProperties;
  requireAuthFirst?: boolean; // New prop to control auth flow
}

const StripeCheckoutWithAuth: React.FC<StripeCheckoutWithAuthProps> = ({ 
  plan = 'premium',
  buttonText = "Start Your Journey Now",
  className = "",
  style = {},
  requireAuthFirst = false // Default: checkout first, auth after
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const handleClick = () => {
    if (requireAuthFirst && !isAuthenticated()) {
      // Flow Option 1: Require login BEFORE checkout
      setAuthMode('signup');
      setShowAuthModal(true);
    } else {
      // Flow Option 2: Direct checkout (current default)
      // StripeCheckout component handles the payment
      // User account is created after payment success
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // After successful auth, trigger checkout
    // This could trigger the StripeCheckout component
  };

  if (requireAuthFirst && !isAuthenticated()) {
    return (
      <>
        <button
          onClick={handleClick}
          className={className}
          style={style}
        >
          {buttonText}
        </button>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode={authMode}
          onAuthSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  // Default: Direct Stripe checkout
  return (
    <StripeCheckout
      plan={plan}
      buttonText={buttonText}
      className={className}
      style={style}
    />
  );
};

export default StripeCheckoutWithAuth;