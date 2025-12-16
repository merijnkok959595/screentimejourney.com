'use client';
import React, { useState, useEffect, useRef } from 'react';
import Footer from '@/components/Common/Footer';
import MilestonesPreview from '@/components/Common/MilestonesPreview';
import LeaderboardPreview from '@/components/Common/LeaderboardPreview';
import StripeCheckout from '@/components/Stripe/StripeCheckout';
import PriceDisplay from '@/components/Common/PriceDisplay';

const ScreenTimeJourneyProductPage = () => {
  const [expandedQuickFaq, setExpandedQuickFaq] = useState<number | null>(null);
  const [showStickyCart, setShowStickyCart] = useState(false);
  const mainButtonRef = useRef<HTMLAnchorElement>(null);

  const toggleQuickFaq = (index: number) => {
    setExpandedQuickFaq(expandedQuickFaq === index ? null : index);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (mainButtonRef.current) {
        const buttonRect = mainButtonRef.current.getBoundingClientRect();
        // Show sticky cart when main button is out of view (below viewport)
        setShowStickyCart(buttonRect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const quickFaqs = [
    {
      question: "What devices does this work for?",
      answer: "This works for all Apple devices. iPhone, Macbooks and iPads.\n\nThe service does not work on Android and Windows devices."
    },
    {
      question: "How will I get my pincode back?",
      answer: "You will have to navigate to your dashboard and click \"unlock\" device. That will prompt you to speak out loud that you will give up on your commitment and that will reveal your pincode."
    },
    {
      question: "Can I cancel / refund my subscription?",
      answer: "Yes, you can cancel anytime in your account dashboard.\n\nWe allow refund with 14 days after your subscriptions without questions asked. If you'd be willing to help us please provide feedback on how we can improve our service.\n\nRequest refund via customer support WhatsApp (preferred) or email."
    }
  ];

  return (
    <main style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Product Section */}
      <div style={{ padding: '40px 0 80px 0' }}>
        <div className="page-width">
          <div className="product-grid">
            
            {/* Left Column - Video/Content */}
            <div>
              <div className="media-card">
                <div 
                  className="product-video-container"
                  style={{ 
                    position: 'relative',
                    width: '605px',
                    height: '605px',
                    maxWidth: '100%',
                    backgroundImage: 'url(https://wati-files.s3.eu-north-1.amazonaws.com/tn_shopify.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
                    borderRadius: '8px'
                  }}>
                </div>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div style={{ padding: '20px 0' }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                margin: '0 0 40px 0',
                color: 'var(--brand-text)',
                fontFamily: 'var(--font-heading)'
              }}>
                Screentimejourney
              </h1>

              <div style={{ marginBottom: '30px' }}>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  color: 'var(--brand-text)',
                  marginBottom: '16px',
                  fontFamily: 'var(--font-body)'
                }}>
                  <PriceDisplay plan="premium" />
                </div>
                <p style={{
                  color: 'rgba(15, 23, 42, 0.75)',
                  fontSize: '0.875rem',
                  margin: '0',
                  fontFamily: 'var(--font-body)',
                  fontWeight: '400',
                  lineHeight: '1.5'
                }}>
                  Your freedom back for less than the price of a coffee.
                </p>
              </div>

              {/* Features with Checkmarks */}
              <div style={{ marginBottom: '30px' }}>
                {/* Top separator line above first bullet */}
                <div style={{
                  height: '1px',
                  backgroundColor: 'rgba(15, 23, 42, 0.08)',
                  margin: '0 0 0 0'
                }}></div>
                
                {[
                  'Stop Doomscrolling',
                  'Break Free From Porn',
                  'Wake & Sleep Without Phone'
                ].map((feature, index, array) => (
                  <div key={index}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '18px 0',
                      fontSize: '1.1rem',
                      fontWeight: '500',
                      color: '#111827',
                      fontFamily: 'DM Serif Display, serif'
                    }}>
                      <i 
                        className="material-icon outlined" 
                        translate="no" 
                        aria-hidden="true" 
                        data-icon="check"
                        style={{ 
                          marginRight: '12px', 
                          flexShrink: 0,
                          fontSize: '24px',
                          color: 'rgba(15, 23, 42, 0.75)'
                        }}
                      >
                        check
                      </i>
                      {feature}
                    </div>
                    {/* Separator line after each feature (including last one) */}
                    <div style={{
                      height: '1px',
                      backgroundColor: 'rgba(15, 23, 42, 0.08)',
                      margin: '0'
                    }}></div>
                  </div>
                ))}
              </div>

              {/* Start Now Button */}
              <div ref={mainButtonRef} style={{ width: '100%', marginBottom: '30px' }}>
                <StripeCheckout 
                  plan="premium"
                  buttonText="Start now"
                  className="btn-primary product-pulse-button"
                  style={{
                    width: '100%',
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                />
              </div>

              {/* Payment Methods */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  {/* Payment method icons */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ width: '40px', height: '24px', background: '#1e3a8a', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 'bold' }}>AMEX</div>
                    <div style={{ width: '40px', height: '24px', background: '#000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 'bold' }}>PAY</div>
                    <div style={{ width: '40px', height: '24px', background: '#ff6b00', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '8px', fontWeight: 'bold' }}>IDEAL</div>
                    <div style={{ width: '40px', height: '24px', background: '#4285f4', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '8px', fontWeight: 'bold' }}>GPAY</div>
                    <div style={{ width: '40px', height: '24px', background: '#e20074', borderRadius: '4px' }}></div>
                    <div style={{ width: '40px', height: '24px', background: '#eb001b', borderRadius: '4px' }}></div>
                    <div style={{ width: '40px', height: '24px', background: '#5d2d91', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '8px', fontWeight: 'bold' }}>SHOP</div>
                    <div style={{ width: '40px', height: '24px', background: '#00a9ff', borderRadius: '4px' }}></div>
                    <div style={{ width: '40px', height: '24px', background: '#1a1f71', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 'bold' }}>VISA</div>
                  </div>
                </div>
              </div>

              {/* Quick FAQ Section */}
              <div style={{ marginBottom: '30px' }}>
                {/* Top separator line above first question */}
                <div style={{
                  height: '1px',
                  backgroundColor: 'rgba(15, 23, 42, 0.08)',
                  margin: '0 0 0 0'
                }}></div>
                
                {quickFaqs.map((faq, index) => (
                  <div key={index}>
                    <div 
                      onClick={() => toggleQuickFaq(index)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '18px 0',
                        fontSize: '1.1rem',
                        fontWeight: '500',
                        color: 'var(--brand-text)',
                        fontFamily: 'var(--font-heading)',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <i 
                        className="material-icon outlined" 
                        translate="no" 
                        aria-hidden="true" 
                        data-icon="question_mark"
                        style={{ 
                          marginRight: '12px', 
                          flexShrink: 0,
                          fontSize: '24px',
                          color: 'rgba(15, 23, 42, 0.75)'
                        }}
                      >
                        question_mark
                      </i>
                      {faq.question}
                    </div>
                    {expandedQuickFaq === index && (
                      <div style={{
                        padding: '0 0 18px 36px',
                        color: 'rgba(15, 23, 42, 0.75)',
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        fontFamily: 'var(--font-body)',
                        whiteSpace: 'pre-line'
                      }}>
                        {faq.answer}
                      </div>
                    )}
                    {/* Separator line after each question (including last one) */}
                    <div style={{
                      height: '1px',
                      backgroundColor: 'rgba(15, 23, 42, 0.08)',
                      margin: '0'
                    }}></div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Guarantee Section - Full Width */}
      <div style={{ padding: '20px 0 80px 0', background: '#f9f9f9' }}>
        <div className="page-width">
          {/* Separation line above guarantee section */}
          <div style={{
            height: '1px',
            backgroundColor: 'rgba(15, 23, 42, 0.08)',
            margin: '0 0 40px 0'
          }}></div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '50px',
            textAlign: 'center'
          }}>
            {/* 15 min Setup */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <i 
                  className="material-icon outlined"
                  translate="no"
                  aria-hidden="true"
                  style={{
                    fontSize: '48px',
                    color: 'rgba(15, 23, 42, 0.75)'
                  }}
                >
                  schedule
                </i>
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: 'var(--brand-text)',
                fontFamily: 'var(--font-heading)',
                marginBottom: '12px'
              }}>
                15 min Setup
              </h3>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(15, 23, 42, 0.75)',
                fontFamily: 'var(--font-body)',
                lineHeight: '1.5',
                margin: '0'
              }}>
                Let me guide you through the setup step by step
              </p>
            </div>

            {/* Fun */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <i 
                  className="material-icon outlined"
                  translate="no"
                  aria-hidden="true"
                  style={{
                    fontSize: '48px',
                    color: 'rgba(15, 23, 42, 0.75)'
                  }}
                >
                  diamond
                </i>
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: 'var(--brand-text)',
                fontFamily: 'var(--font-heading)',
                marginBottom: '12px'
              }}>
                Fun
              </h3>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(15, 23, 42, 0.75)',
                fontFamily: 'var(--font-body)',
                lineHeight: '1.5',
                margin: '0'
              }}>
                Receive weekly milestones & progress updates
              </p>
            </div>

            {/* 100% Refund */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <i 
                  className="material-icon outlined"
                  translate="no"
                  aria-hidden="true"
                  style={{
                    fontSize: '48px',
                    color: 'rgba(15, 23, 42, 0.75)'
                  }}
                >
                  local_offer
                </i>
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: 'var(--brand-text)',
                fontFamily: 'var(--font-heading)',
                marginBottom: '12px'
              }}>
                100% Refund
              </h3>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(15, 23, 42, 0.75)',
                fontFamily: 'var(--font-body)',
                lineHeight: '1.5',
                margin: '0'
              }}>
                If this does not help you I promise a refund
              </p>
            </div>
          </div>

          {/* Separation line below guarantee section */}
          <div style={{
            height: '1px',
            backgroundColor: 'rgba(15, 23, 42, 0.08)',
            margin: '60px 0 0 0'
          }}></div>
        </div>
      </div>

      {/* Milestones Preview Section */}
      <MilestonesPreview showTitle={true} showButton={false} title="Milestones" />

      {/* Leaderboard Preview Section */}
      <LeaderboardPreview showTitle={true} showButton={false} title="Leaderboard" />

      {/* Floating Sticky Add to Cart */}
      {showStickyCart && (
        <div 
          style={{
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--brand-primary)',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(46, 4, 86, 0.2)',
            zIndex: 999,
            padding: '16px 20px',
            animation: 'slideUpFixed 0.3s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            maxWidth: '95vw',
            minWidth: '400px'
          }}
        >
          {/* Product Avatar */}
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '6px',
            backgroundImage: 'url(https://wati-files.s3.eu-north-1.amazonaws.com/tn_shopify.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            flexShrink: 0,
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}></div>

          {/* Product Info */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'white',
              fontFamily: 'var(--font-heading)',
              lineHeight: '1.2',
              marginBottom: '2px'
            }}>
              Screentimejourney
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.8)',
              fontFamily: 'var(--font-body)'
            }}>
              <PriceDisplay plan="premium" />
            </div>
          </div>

          {/* Start Now Button */}
          <StripeCheckout 
            plan="premium"
            buttonText="Start now"
            className="sticky-cart-button"
            style={{
              background: 'white',
              color: 'var(--brand-primary)',
              padding: '12px 28px',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              fontFamily: 'var(--font-body)',
              textDecoration: 'none',
              flexShrink: 0,
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </div>
      )}

      <Footer />
    </main>
  );
};

export default ScreenTimeJourneyProductPage;


