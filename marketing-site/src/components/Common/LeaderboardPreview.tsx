"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface LeaderboardUser {
  name: string;
  days_in_focus: number;
  progress_percentage: number;
  current_level?: {
    level: number;
    title: string;
    media_url?: string;
  };
}

interface LeaderboardPreviewProps {
  showTitle?: boolean;
  showButton?: boolean;
  title?: string;
}

const LeaderboardPreview: React.FC<LeaderboardPreviewProps> = ({ 
  showTitle = false, 
  showButton = true, 
  title = "Community Leaderboard" 
}) => {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [leaderboardData, setLeaderboardData] = useState<{
    male: LeaderboardUser[];
    female: LeaderboardUser[];
  }>({
    male: [],
    female: []
  });
  const [loading, setLoading] = useState(false); // Disabled loading spinner
  const [hasError, setHasError] = useState(false);

  const medals = {
    1: '🥇',
    2: '🥈',
    3: '🥉'
  };

  // Load top 3 from leaderboard
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        console.log('🏆 Loading top 3 performers...');
        
        const apiUrl = 'https://ajvrzuyjarph5fvskles42g7ba0zxtxc.lambda-url.eu-north-1.on.aws';
        
        // Load male and female top 3
        const [maleResponse, femaleResponse] = await Promise.all([
          fetch(`${apiUrl}/get_leaderboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              page: 1,
              page_size: 3,
              get_all_users: false,
              gender_filter: 'male'
            })
          }),
          fetch(`${apiUrl}/get_leaderboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              page: 1,
              page_size: 3,
              get_all_users: false,
              gender_filter: 'female'
            })
          })
        ]);

        if (maleResponse.ok && femaleResponse.ok) {
          const maleData = await maleResponse.json();
          const femaleData = await femaleResponse.json();
          
          console.log('📊 Leaderboard API responses:', { maleData, femaleData });
          
          setLeaderboardData({
            male: maleData.leaderboard || [],
            female: femaleData.leaderboard || []
          });
          
          console.log('✅ Loaded top performers');
        } else {
          throw new Error('Failed to load leaderboard');
        }
      } catch (error) {
        console.error('❌ Error loading leaderboard:', error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  const handleGenderSwitch = (gender: 'male' | 'female') => {
    setSelectedGender(gender);
  };

  if (loading) {
    return (
      <section className="stj-leaderboard-preview-section">
        <div className="stj-leaderboard-preview-container">
          <div className="stj-loading">
            <div className="stj-spinner"></div>
            <p>Loading leaderboard...</p>
          </div>
        </div>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="stj-leaderboard-preview-section">
        <div className="stj-leaderboard-preview-container">
          <div className="stj-error">
            <p>Unable to load leaderboard. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentUsers = leaderboardData[selectedGender] || [];

  return (
    <section className="stj-leaderboard-preview-section">
      <div className="stj-leaderboard-preview-container">
        {showTitle && (
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'var(--brand-text)',
              fontFamily: 'var(--font-heading)',
              margin: '0'
            }}>
              {title}
            </h2>
          </div>
        )}
        <div className="stj-preview-content">

          {/* Gender selection */}
          <div className="stj-gender-tabs">
            <button
              className={`button ${selectedGender === 'male' ? 'button--primary stj-tab-active' : 'button--secondary'} default stj-tab-btn`}
              onClick={() => handleGenderSwitch('male')}
            >
              <span className="grid align-items-center">
                🙋‍♂️ Men
              </span>
            </button>
            <button
              className={`button ${selectedGender === 'female' ? 'button--primary stj-tab-active' : 'button--secondary'} default stj-tab-btn`}
              onClick={() => handleGenderSwitch('female')}
            >
              <span className="grid align-items-center">
                🙋‍♀️ Women
              </span>
            </button>
          </div>
          
          {/* Top 3 Podium Cards */}
          <div className="stj-preview-top-cards-grid">
            {currentUsers.map((user, index) => {
              const rank = index + 1;
              const displayName = user.name || 'Anonymous';
              
              return (
                <div key={index} className="stj-preview-top-card" data-rank={rank}>
                  <div className="stj-card-medal">{medals[rank as keyof typeof medals] || '🏅'}</div>
                  <div className="stj-card-username">{displayName}</div>
                  <div className="stj-card-stats">
                    <div className="stj-card-days">
                      <span className="stj-card-days-number">{user.days_in_focus || 0}</span>
                      <span className="stj-card-days-label">days in focus</span>
                    </div>
                    <div className="stj-card-progress">
                      <span className="stj-card-progress-percent">{user.progress_percentage || 0}%</span>
                      <span className="stj-card-progress-label">of the world</span>
                    </div>
                  </div>
                  {user.current_level?.media_url && (
                    <div className="stj-card-image">
                      <img 
                        src={user.current_level.media_url} 
                        alt={user.current_level.title || 'Milestone'} 
                        loading="lazy" 
                        width="350" 
                        height="350"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* See leaderboard button */}
          {showButton && (
            <div className="stj-preview-actions">
              <Link href="/leaderboard" className="button button--primary default">
                <span className="grid align-items-center">
                  See leaderboard
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LeaderboardPreview;







