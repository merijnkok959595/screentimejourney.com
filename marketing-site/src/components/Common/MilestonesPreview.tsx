"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface MilestoneData {
  level: number;
  title: string;
  emoji: string;
  description: string;
  days_range?: string;
  milestone_day: number;
  media_url?: string;
}

interface MilestonesPreviewProps {
  showTitle?: boolean;
  showButton?: boolean;
  title?: string;
}

const MilestonesPreview: React.FC<MilestonesPreviewProps> = ({ 
  showTitle = false, 
  showButton = true, 
  title = "Weekly Milestones" 
}) => {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [milestonesData, setMilestonesData] = useState<{
    male: MilestoneData[];
    female: MilestoneData[];
  }>({
    male: [],
    female: []
  });
  const [loading, setLoading] = useState(false); // Disabled loading spinner
  const [hasError, setHasError] = useState(false);

  // Load milestones from API
  useEffect(() => {
    const loadMilestones = async () => {
      try {
        console.log('🎯 Loading milestone preview data...');
        
        const apiUrl = 'https://ajvrzuyjarph5fvskles42g7ba0zxtxc.lambda-url.eu-north-1.on.aws';
        
        // Load both male and female milestones
        const [maleResponse, femaleResponse] = await Promise.all([
          fetch(`${apiUrl}/get_milestones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gender: 'male', include_all: true })
          }),
          fetch(`${apiUrl}/get_milestones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gender: 'female', include_all: true })
          })
        ]);

        if (maleResponse.ok && femaleResponse.ok) {
          const maleData = await maleResponse.json();
          const femaleData = await femaleResponse.json();
          
          console.log('📊 Milestone API responses:', { maleData, femaleData });
          
          const maleMilestones = maleData.milestones || maleData.data || [];
          const femaleMilestones = femaleData.milestones || femaleData.data || [];
          
          // Filter for Level 0 (Ground Zero) and Level 10 (King/Queen) only
          setMilestonesData({
            male: maleMilestones.filter((m: MilestoneData) => m.level === 0 || m.level === 10),
            female: femaleMilestones.filter((m: MilestoneData) => m.level === 0 || m.level === 10)
          });
          
          console.log('✅ Filtered preview milestones loaded');
        } else {
          throw new Error('Failed to load milestones');
        }
      } catch (error) {
        console.error('❌ Error loading milestones:', error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    loadMilestones();
  }, []);

  const handleGenderSwitch = (gender: 'male' | 'female') => {
    setSelectedGender(gender);
  };

  if (loading) {
    return (
      <section className="stj-milestone-preview-section">
        <div className="stj-milestone-preview-container">
          <div className="stj-loading">
            <div className="stj-spinner"></div>
            <p>Loading milestones...</p>
          </div>
        </div>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="stj-milestone-preview-section">
        <div className="stj-milestone-preview-container">
          <div className="stj-error">
            <p>Unable to load milestones. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentMilestones = milestonesData[selectedGender] || [];

  return (
    <section className="stj-milestone-preview-section">
      <div className="stj-milestone-preview-container">
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
        <div className="stj-milestone-preview-content">
          
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

          {/* Milestone cards */}
          <div className="stj-milestone-cards">
            {currentMilestones.map((milestone) => (
              <div key={milestone.level} className="stj-milestone-preview-card" data-level={milestone.level}>
                <div className="stj-milestone-header">
                  <div className="stj-milestone-left">
                    <div className="stj-milestone-emoji">{milestone.emoji}</div>
                    <div className="stj-milestone-info">
                      <h3 className="stj-milestone-title">{milestone.title}</h3>
                    </div>
                  </div>
                  <div className="stj-milestone-days">
                    Days {milestone.days_range || milestone.milestone_day}
                  </div>
                </div>
                <div className="stj-milestone-description">{milestone.description}</div>
                {milestone.media_url && (
                  <div className="stj-milestone-image">
                    <img 
                      src={milestone.media_url} 
                      alt={milestone.title} 
                      loading="lazy" 
                      width="350" 
                      height="350"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* See milestones button */}
          {showButton && (
            <div className="stj-milestone-actions">
              <Link href="/milestones" className="button button--primary default">
                <span className="grid align-items-center">
                  See milestones
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MilestonesPreview;







