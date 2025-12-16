"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Types
interface MilestoneData {
  level: number;
  emoji: string;
  title: string;
  days_range?: string;
  milestone_day?: number;
  description: string;
  media_url?: string;
}

interface MilestonesProps {
  maleLabel?: string;
  femaleLabel?: string;
}

const Milestones: React.FC<MilestonesProps> = ({
  maleLabel = "Men's Journey",
  femaleLabel = "Women's Journey"
}) => {
  const [isLoading, setIsLoading] = useState(false); // Disabled loading spinner
  const [hasError, setHasError] = useState(false);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [milestonesData, setMilestonesData] = useState<{
    male: MilestoneData[];
    female: MilestoneData[];
  }>({
    male: [],
    female: []
  });

  const componentId = useRef(`milestones-${Date.now()}`).current;
  const apiUrl = 'https://ajvrzuyjarph5fvskles42g7ba0zxtxc.lambda-url.eu-north-1.on.aws';

  // Load milestones data from API
  const loadMilestones = async () => {
    try {
      setIsLoading(true);
      console.log('🎯 Loading milestones from STJ API...');
      
      // Load male and female milestones in parallel
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
        
        setMilestonesData({
          male: maleData.milestones || maleData.data || [],
          female: femaleData.milestones || femaleData.data || []
        });
        
        console.log('✅ Milestones loaded successfully');
        setHasError(false);
      } else {
        throw new Error('Failed to load milestones');
      }
    } catch (error) {
      console.error('❌ Error loading milestones:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMilestones();
  }, []);

  const handleGenderSwitch = (gender: 'male' | 'female') => {
    setSelectedGender(gender);
  };

  if (isLoading) {
    return (
      <section className="stj-milestone-section">
        <div className="stj-milestone-container">
          <div className="stj-loading">
            <div className="stj-spinner"></div>
            <h3 className="stj-loading-title">Loading milestones...</h3>
            <p className="stj-loading-subtitle">Please wait while we fetch milestone data</p>
          </div>
        </div>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="stj-milestone-section">
        <div className="stj-milestone-container">
          <div className="stj-error">
            <p>Unable to load milestones. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentMilestones = milestonesData[selectedGender];

  return (
    <section className="stj-milestone-section">
      <div className="stj-milestone-container">
        <div className="stj-content">
          <div className="stj-alignment-rails">
            {/* Gender Selection Buttons */}
            <div className="stj-button-row">
              <div className="stj-btn-shell">
                <button
                  className={`button ${selectedGender === 'male' ? 'button--primary stj-tab-active' : 'button--secondary'} default`}
                  onClick={() => handleGenderSwitch('male')}
                >
                  <span className="grid align-items-center">
                    🙋‍♂️ {maleLabel}
                  </span>
                </button>
              </div>
              <div className="stj-btn-shell">
                <button
                  className={`button ${selectedGender === 'female' ? 'button--primary stj-tab-active' : 'button--secondary'} default`}
                  onClick={() => handleGenderSwitch('female')}
                >
                  <span className="grid align-items-center">
                    🙋‍♀️ {femaleLabel}
                  </span>
                </button>
              </div>
            </div>

            {/* Milestones Content */}
            <div className="stj-milestones-content">
              <div className="stj-milestones-list">
                {currentMilestones.map((milestone, index) => (
                  <div key={`${selectedGender}-${milestone.level}-${index}`} className="stj-milestone-card" data-level={milestone.level}>
                    <div className="stj-milestone-header">
                      <div className="stj-milestone-left">
                        <div className="stj-milestone-emoji">{milestone.emoji || '🎯'}</div>
                        <div className="stj-milestone-info">
                          <h3 className="stj-milestone-title">{milestone.title || 'Milestone'}</h3>
                        </div>
                      </div>
                      <div className="stj-milestone-days">
                        Days {milestone.days_range || milestone.milestone_day}
                      </div>
                    </div>
                    {milestone.description && (
                      <div className="stj-milestone-description">{milestone.description}</div>
                    )}
                    {milestone.media_url && (
                      <div className="stj-milestone-image">
                        <img 
                          src={milestone.media_url} 
                          alt={milestone.title || 'Milestone'} 
                          loading="lazy" 
                          width="350" 
                          height="350"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Start Now Button */}
        <div className="stj-start-now-section">
          <div className="stj-start-now-container">
            <Link href="/product/screentimejourney" className="button button--primary default">
              <span className="grid align-items-center">Start now</span>
            </Link>
          </div>
        </div>
        
        {/* Separator */}
        <div style={{ padding: '20px 0 10px 0' }}>
          <div style={{ 
            height: '1px', 
            backgroundColor: '#EEEEEE', 
            maxWidth: '1100px',
            margin: '0 auto',
            width: 'calc(100% - 80px)'
          }}></div>
        </div>
      </div>
    </section>
  );
};

export default Milestones;







