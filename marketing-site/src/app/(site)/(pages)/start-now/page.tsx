import React from 'react';
import Separator from '@/components/Common/Separator';
import Footer from '@/components/Common/Footer';
import StripeCheckout from '@/components/Stripe/StripeCheckout';

const StartNowPage = () => {
  return (
    <main>
      {/* Hero Section */}
      <div style={{ padding: '60px 0 60px 0', background: '#f9f9f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: '700', 
            color: '#111827',
            marginBottom: '0',
            fontFamily: 'DM Serif Display, serif'
          }}>
            Start Your Journey Today
          </h1>
        </div>
      </div>
      
      {/* Plans Section */}
      <div style={{ padding: '80px 0', background: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              marginBottom: '0.5rem' 
            }}>
              SCREEN TIME JOURNEY ©
            </p>
            <h2 style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: '#111827',
              marginBottom: '2rem',
              fontFamily: 'DM Serif Display, serif'
            }}>
              Choose Your Plan
            </h2>
          </div>

          {/* Main CTA Card */}
          <div style={{ 
            maxWidth: '600px', 
            margin: '0 auto', 
            background: '#ffffff',
            border: '2px solid #2e0456',
            borderRadius: '16px',
            padding: '60px 40px',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(46, 4, 86, 0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚀</div>
            <h3 style={{ 
              fontSize: '2.25rem', 
              fontWeight: '700', 
              marginBottom: '16px',
              fontFamily: 'DM Serif Display, serif',
              color: '#111827'
            }}>
              Screen Time Journey
            </h3>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#6b7280', 
              marginBottom: '32px',
              lineHeight: '1.7'
            }}>
              Complete system to break free from digital addiction, reset your dopamine, and build unshakeable focus.
            </p>

            {/* Features */}
            <div style={{ marginBottom: '40px', textAlign: 'left' }}>
              {[
                '🎯 Personal milestone tracking system',
                '🧠 Dopamine reset protocols',
                '📱 Screen time blocking tools',
                '💪 Community leaderboard access',
                '📚 Complete transformation guide',
                '🔒 Privacy-first approach'
              ].map((feature, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '12px',
                  fontSize: '1rem',
                  color: '#374151'
                }}>
                  <span style={{ marginRight: '12px' }}>{feature.split(' ')[0]}</span>
                  <span>{feature.substring(feature.indexOf(' ') + 1)}</span>
                </div>
              ))}
            </div>

            <StripeCheckout 
              plan="premium"
              buttonText="Start Your Journey Now"
              style={{ 
                display: 'inline-block',
                padding: '20px 40px',
                backgroundColor: '#2e0456',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '1.25rem',
                marginBottom: '16px',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer'
              }}
            />
            
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#9ca3af',
              margin: '16px 0 0 0'
            }}>
              Join 2,847+ people transforming their relationship with technology
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Why Start Today Section */}
      <div style={{ padding: '80px 0', background: '#f9f9f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: '#111827',
              marginBottom: '2rem',
              fontFamily: 'DM Serif Display, serif'
            }}>
              Why Start Today?
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏰</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
                Every Day Counts
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.7' }}>
                The average person spends 7+ hours daily on screens. Each day you wait is another day lost to digital distraction.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📈</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
                Proven System
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.7' }}>
                Join thousands who have successfully transformed their digital habits using our milestone-based approach.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔒</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
                Your Privacy Matters
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.7' }}>
                We never sell your data. Your journey is private, secure, and entirely under your control.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default StartNowPage;