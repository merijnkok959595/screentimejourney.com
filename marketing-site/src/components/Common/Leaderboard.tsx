"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Types
interface CurrentLevel {
  level: number;
  emoji: string;
  title: string;
  media_url?: string;
}

interface LeaderboardEntry {
  username: string;
  name?: string;
  gender: 'male' | 'female';
  gender_emoji: string;
  days_in_focus: number;
  progress_percentage: number;
  current_level: CurrentLevel;
  filtered_rank?: number;
}

interface LeaderboardProps {
  title?: string;
  subtitle?: string;
  maleLabel?: string;
  femaleLabel?: string;
}


const Leaderboard: React.FC<LeaderboardProps> = ({
  title = "Journey Leaderboard",
  subtitle = "Top performers on their Screen Time Journey",
  maleLabel = "Men",
  femaleLabel = "Women"
}) => {
  const [isLoading, setIsLoading] = useState(false); // Disabled loading spinner
  const [hasError, setHasError] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<'male' | 'female'>('male');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const componentId = useRef(`leaderboard-${Date.now()}`).current;
  const apiUrl = 'https://ajvrzuyjarph5fvskles42g7ba0zxtxc.lambda-url.eu-north-1.on.aws';
  const PAGE_SIZE = 50;

  // Load leaderboard data from API
  const loadLeaderboard = async (reset = false) => {
    if (isLoadingMore && !reset) return;
    
    try {
      setIsLoadingMore(true);
      if (reset) {
        setCurrentPage(1);
        setLeaderboardData([]);
      }
      
      console.log(`🏆 Loading leaderboard page ${reset ? 1 : currentPage} for ${currentFilter}...`);
      
      const response = await fetch(`${apiUrl}/get_leaderboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          page: reset ? 1 : currentPage,
          page_size: PAGE_SIZE,
          get_all_users: false,
          gender_filter: currentFilter
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const newEntries: LeaderboardEntry[] = data.leaderboard || data.data || [];
        const pagination = data.pagination || {};
        
        if (reset) {
          setLeaderboardData(newEntries);
        } else {
          setLeaderboardData(prev => [...prev, ...newEntries]);
        }
        
        setTotalPages(Math.ceil(pagination.total_entries / PAGE_SIZE));
        
        console.log('✅ Leaderboard loaded successfully');
        setHasError(false);
        setIsLoading(false);
      } else {
        throw new Error('Failed to load leaderboard');
      }
    } catch (error) {
      console.error('❌ Error loading leaderboard:', error);
      setHasError(true);
      setIsLoading(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadLeaderboard(true);
  }, [currentFilter]);

  const handleGenderFilter = (filter: 'male' | 'female') => {
    setCurrentFilter(filter);
    setCurrentPage(1);
    setLeaderboardData([]); // Clear existing data
    setIsLoading(true); // Show loading state
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      setCurrentPage(prev => prev + 1);
      loadLeaderboard(false);
    }
  };

  // Filter and rank data from API
  const filteredData = leaderboardData
    .filter(entry => entry.gender === currentFilter)
    .sort((a, b) => {
      const scoreA = (a.days_in_focus || 0) * 10 + (a.progress_percentage || 0);
      const scoreB = (b.days_in_focus || 0) * 10 + (b.progress_percentage || 0);
      return scoreB - scoreA;
    })
    .map((entry, index) => ({ ...entry, filtered_rank: index + 1 }));

  const topCards = filteredData.slice(0, 3);
  const remainingUsers = filteredData.slice(3);

  if (isLoading) {
    return (
      <section className="stj-leaderboard-section">
        <div className="stj-leaderboard-container">
          <div className="stj-loading">
            <div className="stj-spinner"></div>
            <h3 className="stj-loading-title">Loading leaderboard...</h3>
            <p className="stj-loading-subtitle">Please wait while we fetch leaderboard data</p>
          </div>
        </div>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="stj-leaderboard-section">
        <div className="stj-leaderboard-container">
          <div className="stj-error">
            <p>Unable to load leaderboard. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="stj-leaderboard-section">
      <div className="stj-leaderboard-container">
        {/* Gender Filter Tabs */}
        <div className="stj-gender-tabs">
          <button
            className={`button ${currentFilter === 'male' ? 'button--primary stj-tab-active' : 'button--secondary'} default`}
            onClick={() => handleGenderFilter('male')}
          >
            <span className="grid align-items-center">
              🙋‍♂️ {maleLabel}
            </span>
          </button>
          <button
            className={`button ${currentFilter === 'female' ? 'button--primary stj-tab-active' : 'button--secondary'} default`}
            onClick={() => handleGenderFilter('female')}
          >
            <span className="grid align-items-center">
              🙋‍♀️ {femaleLabel}
            </span>
          </button>
        </div>

        <div className="stj-leaderboard-content">
          {/* Top 3 Square Cards */}
          <div className="stj-top-cards-grid">
            {topCards.length >= 3 ? (
              // Display in order: Silver, Gold, Bronze (2nd, 1st, 3rd)
              <>
                {/* Silver - 2nd place */}
                <TopCard entry={topCards[1]} rank={2} />
                {/* Gold - 1st place */}
                <TopCard entry={topCards[0]} rank={1} />
                {/* Bronze - 3rd place */}
                <TopCard entry={topCards[2]} rank={3} />
              </>
            ) : (
              topCards.map((entry, index) => (
                <TopCard key={`top-${entry.username}-${index}`} entry={entry} rank={index + 1} />
              ))
            )}
          </div>

          {/* Remaining Users Table */}
          <div className="stj-users-table-container rte">
            <table className="stj-users-table">
              <caption className="sr-only">Leaderboard</caption>
              <colgroup>
                <col style={{width: "10%"}} />
                <col style={{width: "25%"}} />
                <col style={{width: "10%"}} />
                <col style={{width: "30%"}} />
                <col style={{width: "15%"}} />
                <col style={{width: "10%"}} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">USERNAME</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Level</th>
                  <th scope="col">DAYS IN FOCUS</th>
                  <th scope="col">OF THE WORLD</th>
                </tr>
              </thead>
              <tbody>
                {remainingUsers.map((entry, index) => (
                  <TableRow key={`row-${entry.username}-${index}`} entry={entry} rank={index + 4} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="stj-pagination">
            <div className="stj-pagination-info">
              <span>Showing {leaderboardData.length} {currentFilter === 'male' ? 'Men' : 'Women'}</span>
            </div>
            <div className="stj-pagination-controls">
              {currentPage < totalPages && (
                <button 
                  className="button button--primary stj-load-more-btn"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  <span className={isLoadingMore ? 'hidden' : ''}>Load More Warriors</span>
                  <span className={!isLoadingMore ? 'hidden' : ''}>⏳</span>
                </button>
              )}
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
              maxWidth: '1200px',
              margin: '0 auto',
              width: 'calc(100% - 80px)'
            }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Top Card Component
const TopCard: React.FC<{ entry: LeaderboardEntry; rank: number }> = ({ entry, rank }) => {
  const medals = ['🥇', '🥈', '🥉'];
  const displayName = entry.username || entry.name || 'Anonymous Warrior';

  return (
    <div className="stj-top-card" data-rank={rank}>
      <div className="stj-card-medal">{medals[rank - 1]}</div>
      <div className="stj-card-username">{displayName}</div>
      <div className="stj-card-stats">
        <div className="stj-card-days">
          <span className="stj-card-days-number">{entry.days_in_focus || 0}</span>
          <span className="stj-card-days-label">days in focus</span>
        </div>
        <div className="stj-card-progress">
          <span className="stj-card-progress-percent">{entry.progress_percentage || 0}%</span>
          <span className="stj-card-progress-label">of the world</span>
        </div>
      </div>
      {entry.current_level?.media_url && (
        <div className="stj-card-image">
          <img 
            src={entry.current_level.media_url} 
            alt={entry.current_level.title || 'Milestone'} 
            loading="lazy" 
            width="350" 
            height="350"
          />
        </div>
      )}
    </div>
  );
};

// Table Row Component
const TableRow: React.FC<{ entry: LeaderboardEntry; rank: number }> = ({ entry, rank }) => {
  const displayName = entry.username || entry.name || 'Anonymous Warrior';
  const genderLabel = entry.gender === 'male' ? 'Male' : 'Female';

  return (
    <tr className="stj-table-row" data-rank={rank}>
      <td className="stj-table-rank">
        <span className="stj-table-rank-number">#{rank}</span>
      </td>
      <td className="stj-table-warrior">
        <span className="stj-table-name">{displayName}</span>
      </td>
      <td className="stj-table-gender">
        <span className="stj-emoji-wrapper stj-table-gender-emoji" aria-label={genderLabel}>
          {entry.gender_emoji}
        </span>
      </td>
      <td className="stj-table-level">
        <div className="stj-level-container">
          <span className="stj-emoji-wrapper stj-table-level-emoji">
            {entry.current_level?.emoji || '🎯'}
          </span>
          <span className="stj-table-level-title">
            {entry.current_level?.title || 'Beginner'}
          </span>
        </div>
      </td>
      <td className="stj-table-days">
        <span className="stj-table-days-number">{entry.days_in_focus || 0}</span>
      </td>
      <td className="stj-table-progress">
        <span className="stj-table-progress-percent">{entry.progress_percentage || 0}%</span>
      </td>
    </tr>
  );
};

export default Leaderboard;







