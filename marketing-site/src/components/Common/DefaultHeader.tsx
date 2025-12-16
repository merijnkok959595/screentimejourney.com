"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { isAuthenticated, logout, AUTH_CONFIG } from '@/lib/auth';

const DefaultHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);

  // Check authentication status on mount and when storage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      setUserAuthenticated(isAuthenticated());
    };
    
    checkAuthStatus();
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  // Shrink header on scroll (Screen Time Journey method)
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.default-header');
      const announcementBar = document.querySelector('.announcement-bar');
      
      if (header && announcementBar) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
          announcementBar.classList.add('scrolled');
          setIsScrolled(true);
        } else {
          header.classList.remove('scrolled');
          announcementBar.classList.remove('scrolled');
          setIsScrolled(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !(event.target as Element).closest('.header-mobile-menu')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <header 
      className={`
        fixed left-0 w-full z-50 transition-transform duration-300 ease-in-out
        top-[42px]
        bg-[#f9f9f9] text-[#0F172A] default-header header
        ${isScrolled ? "scrolled" : ""}
      `}
    >
      <div className="header-inner">
        {/* Mobile hamburger menu (Grid Column 1) */}
        <div className="header-mobile-menu">
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {!mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="icon icon-hamburger text-[#2E0456]" viewBox="0 0 18 16">
                <path fill="currentColor" d="M1 .5a.5.5 0 1 0 0 1h15.71a.5.5 0 0 0 0-1zM.5 8a.5.5 0 0 1 .5-.5h15.71a.5.5 0 0 1 0 1H1A.5.5 0 0 1 .5 8m0 7a.5.5 0 0 1 .5-.5h15.71a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="icon icon-close text-[#2E0456]" viewBox="0 0 18 17">
                <path fill="currentColor" d="M.865 15.978a.5.5 0 0 0 .707.707l7.433-7.431 7.579 7.282a.501.501 0 0 0 .846-.37.5.5 0 0 0-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 1 0-.707-.708L8.991 7.853 1.413.573a.5.5 0 1 0-.693.72l7.563 7.268z"></path>
              </svg>
            )}
          </button>
          
          <div className={`mobile-menu-dropdown ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <div className="mobile-menu-nav">
              <Link 
                className="mobile-menu-item" 
                href="/about-me"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Me
              </Link>
              <Link
                className="mobile-menu-item"
                href="/product/screentimejourney"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start Now
              </Link>
              <Link 
                className="mobile-menu-item" 
                href="/milestones"
                onClick={() => setMobileMenuOpen(false)}
              >
                Milestones
              </Link>
              <Link 
                className="mobile-menu-item" 
                href="/leaderboard"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leaderboard
              </Link>
            </div>
            <div className="mobile-menu-actions">
              {userAuthenticated ? (
                <>
                  <Link
                    className="btn-primary"
                    href={AUTH_CONFIG.DASHBOARD_URL}
                    onClick={() => setMobileMenuOpen(false)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Dashboard
                  </Link>
                  <button
                    className="btn-outline-secondary"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    className="btn-primary"
                    href="/product/screentimejourney"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Start Now
                  </Link>
                  <Link
                    className="btn-outline-secondary"
                    href="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Logo (Grid Column 2 - CENTERED) */}
        <Link className="header-logo" href="/">
          <img 
            src="https://cdn.shopify.com/s/files/1/0866/6749/3623/files/stj_trimmed_png.png?v=1757864303" 
            alt="Screen Time Journey Logo"
          />
        </Link>
        
        {/* Navigation Links (Desktop Only) */}
        <nav className="header-nav">
          <Link href="/about-me">About Me</Link>
          <Link href="/product/screentimejourney">Start Now</Link>
          <Link href="/milestones">Milestones</Link>
          <Link href="/leaderboard">Leaderboard</Link>
        </nav>
        
        {/* Action Buttons (Desktop Only) */}
        <div className="header-actions">
          <div className="header-buttons-desktop">
            {userAuthenticated ? (
              <>
                <Link 
                  className="btn-primary" 
                  href={AUTH_CONFIG.DASHBOARD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Dashboard
                </Link>
                <button
                  className="btn-outline-secondary"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn-primary" href="/product/screentimejourney">Start Now</Link>
                <Link className="btn-outline-secondary" href="/signin">Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DefaultHeader;