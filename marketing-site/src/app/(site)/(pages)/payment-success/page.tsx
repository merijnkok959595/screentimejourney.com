'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Footer from '@/components/Common/Footer';
import { COGNITO_CONFIG } from '@/lib/cognito';

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [userAccount, setUserAccount] = useState<any>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      handlePaymentSuccess();
    }
  }, [sessionId]);

  useEffect(() => {
    if (status === 'success' && userAccount && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    if (redirectCountdown === 0 && userAccount?.dashboardUrl) {
      window.location.href = userAccount.dashboardUrl;
    }
  }, [status, userAccount, redirectCountdown]);

  const handlePaymentSuccess = async () => {
    try {
      // Get payment session details
      const sessionResponse = await fetch(`/api/stripe/session?session_id=${sessionId}`);
      
      if (!sessionResponse.ok) {
        throw new Error('Failed to retrieve payment details');
      }

      const sessionData = await sessionResponse.json();
      
      // Create user account
      const userResponse = await fetch('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: sessionData.customer_details.email,
          stripeCustomerId: sessionData.customer,
          stripeSubscriptionId: sessionData.subscription,
          plan: sessionData.metadata?.priceId || 'premium',
          source: 'marketing-site'
        }),
      });

      if (!userResponse.ok) {
        throw new Error('Failed to create user account');
      }

      const userData = await userResponse.json();
      setUserAccount(userData);
      setStatus('success');
      
    } catch (error) {
      console.error('Payment success handling error:', error);
      setStatus('error');
    }
  };

  const handleManualRedirect = () => {
    if (userAccount?.dashboardUrl) {
      window.location.href = userAccount.dashboardUrl;
    } else {
      window.location.href = COGNITO_CONFIG.DASHBOARD_URL;
    }
  };

  if (status === 'processing') {
    return (
      <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <div style={{ padding: '120px 0' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '24px' }}>⏳</div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '16px',
              color: '#111827'
            }}>
              Processing Your Payment
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '32px' }}>
              Setting up your Screen Time Journey account...
            </p>
            <div style={{
              width: '200px',
              height: '4px',
              background: '#e5e5e5',
              borderRadius: '2px',
              margin: '0 auto',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: '#2e0456',
                animation: 'loading 2s ease-in-out infinite',
                transformOrigin: 'left'
              }}></div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <div style={{ padding: '120px 0' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '24px' }}>❌</div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '16px',
              color: '#dc2626'
            }}>
              Something Went Wrong
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '32px' }}>
              Your payment was successful, but we encountered an issue setting up your account.
              Please contact support for assistance.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleManualRedirect}
                style={{
                  padding: '16px 32px',
                  backgroundColor: '#2e0456',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Go to Dashboard
              </button>
              <a
                href="mailto:support@screentimejourney.com"
                style={{
                  padding: '16px 32px',
                  border: '2px solid #2e0456',
                  color: '#2e0456',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'inline-block'
                }}
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ padding: '120px 0' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🎉</div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            marginBottom: '16px',
            color: '#059669'
          }}>
            Welcome to Screen Time Journey!
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '32px' }}>
            Your account has been created successfully. Redirecting to your dashboard in{' '}
            <strong style={{ color: '#2e0456' }}>{redirectCountdown}</strong> seconds...
          </p>

          {userAccount && (
            <div style={{
              background: 'white',
              padding: '32px',
              borderRadius: '12px',
              border: '1px solid #e5e5e5',
              marginBottom: '32px',
              textAlign: 'left'
            }}>
              <h3 style={{ marginBottom: '16px', color: '#111827', fontSize: '1.25rem', fontWeight: '600' }}>
                Account Details
              </h3>
              <p style={{ margin: '8px 0', color: '#6b7280' }}>
                <strong>Email:</strong> {userAccount.user?.email}
              </p>
              {userAccount.user?.temporaryPassword && (
                <div style={{
                  background: '#fef3c7',
                  padding: '16px',
                  borderRadius: '8px',
                  marginTop: '16px'
                }}>
                  <p style={{ margin: '0', fontSize: '0.875rem', color: '#92400e' }}>
                    <strong>Important:</strong> You'll need to set a new password when you first log in.
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleManualRedirect}
            style={{
              padding: '16px 32px',
              backgroundColor: '#2e0456',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            Continue to Dashboard
          </button>
          
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            If you're not redirected automatically, click the button above.
          </p>
        </div>
      </div>
      <Footer />
      
      <style jsx>{`
        @keyframes loading {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
      `}</style>
    </main>
  );
};

export default PaymentSuccessPage;
