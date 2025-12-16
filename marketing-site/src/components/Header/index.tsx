"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isAuthenticated, logout, AUTH_CONFIG } from '@/lib/auth';

const HomeHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [headerAnimate, setHeaderAnimate] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  // Initialize transparent state - start as true if on home page
  const [isTransparent, setIsTransparent] = useState(isHomePage);
  
  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      setUserAuthenticated(isAuthenticated());
    };
    
    checkAuthStatus();
    
    // Listen for storage changes
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  // Scroll detectie (Hero trigger) + Shopify header appear effect + Logo animation
  useEffect(() => {
    if (!isHomePage) {
      setIsTransparent(false);
      return;
    }

    let lastScrollTop = 0;
    let ticking = false;
    let lastLogoState = 'normal'; // Track logo state to avoid redundant animations
    
    // Check if we're on mobile to prevent logo animation positioning issues
    const isMobile = () => window.innerWidth <= 1024;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const header = document.querySelector('.header');
          const logo = document.querySelector('.header-logo');
          
          // Transparent state
          const wasTransparent = isTransparent;
          const nowTransparent = scrollTop < 80;
          setIsTransparent(nowTransparent);
          
          // Scrolled state for header shrinking
          if (scrollTop > 50) {
            setScrolled(true);
          } else {
            setScrolled(false);
            setHeaderHidden(false);
            setHeaderAnimate(false);
            if (header) {
              header.classList.remove('shopify-section-header-hidden', 'shopify-section-header-sticky', 'animate');
            }
          }

          // ===== LOGO ANIMATION LOGIC =====
          if (logo && !isMobile()) { // Skip logo animations on mobile to prevent positioning issues
            // Crossing the 80px threshold
            if (wasTransparent !== nowTransparent) {
              // Remove any existing animation classes
              logo.classList.remove('logo-animate-shrink', 'logo-animate-grow');
              
              // Force reflow to restart animation
              void (logo as HTMLElement).offsetWidth;
              
              if (scrollTop > lastScrollTop && scrollTop >= 80) {
                // Scrolling DOWN past 80px: Logo shrinks (big → normal)
                console.log('🔽 Animating logo SHRINK (big → normal)');
                logo.classList.add('logo-animate-shrink');
                lastLogoState = 'shrink';
              } else if (scrollTop < lastScrollTop && scrollTop < 80) {
                // Scrolling UP past 80px: Logo grows (small → normal)
                console.log('🔼 Animating logo GROW (small → normal)');
                logo.classList.add('logo-animate-grow');
                lastLogoState = 'grow';
              }
            }
          } else if (logo && isMobile()) {
            // On mobile, remove any animation classes that might exist
            logo.classList.remove('logo-animate-shrink', 'logo-animate-grow');
            logo.style.animation = 'none';
            logo.style.transform = 'none';
          }

          // Shopify header appear effect (hide on scroll down, reveal on scroll up)
          if (header) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
              // Scrolling down - hide header
              header.classList.add('shopify-section-header-hidden', 'shopify-section-header-sticky');
              header.classList.remove('animate');
              setHeaderHidden(true);
              setHeaderAnimate(false);
            } else if (scrollTop < lastScrollTop && scrollTop > 100) {
              // Scrolling up - reveal header
              header.classList.add('shopify-section-header-sticky', 'animate');
              header.classList.remove('shopify-section-header-hidden');
              setHeaderHidden(false);
              setHeaderAnimate(true);
            }
          }

          lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll(); // ✅ direct bij load correct
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage, isTransparent]); // Add isTransparent to dependencies

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

  // Logo switching handled entirely by CSS - no React state needed

  return (
    <header 
      className={`
        fixed left-0 w-full z-50 transition-transform duration-300 ease-in-out
        top-[42px]
        ${isTransparent && isHomePage ? "bg-transparent text-white header-transparent" : "bg-[#f9f9f9] text-[#0F172A]"}
        ${scrolled ? "scrolled" : ""}
        ${headerHidden ? "shopify-section-header-hidden -translate-y-full" : ""}
        ${headerAnimate ? "animate translate-y-0" : ""}
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" className={`icon icon-hamburger ${isTransparent && isHomePage ? 'text-white' : 'text-[#2E0456]'}`} viewBox="0 0 18 16">
                <path fill="currentColor" d="M1 .5a.5.5 0 1 0 0 1h15.71a.5.5 0 0 0 0-1zM.5 8a.5.5 0 0 1 .5-.5h15.71a.5.5 0 0 1 0 1H1A.5.5 0 0 1 .5 8m0 7a.5.5 0 0 1 .5-.5h15.71a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" className={`icon icon-close ${isTransparent && isHomePage ? 'text-white' : 'text-[#2E0456]'}`} viewBox="0 0 18 17">
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
          {/* Dark logo */}
          <img
            src="https://cdn.shopify.com/s/files/1/0866/6749/3623/files/stj_favi_png.png?v=1757864303"
            alt="Screen Time Journey Logo"
            className="logo-dark"
          />
          
          {/* Inverted logo */}
          <img
            src="https://cdn.shopify.com/s/files/1/0866/6749/3623/files/stj_favi_inverted_yellow.png?v=1757864433"
            alt="Screen Time Journey Logo"
            className="logo-inverted"
          />
        </Link>
        
        {/* Desktop Navigation + Actions (Grid Column 3) */}
        <div className="header-desktop-wrapper">
          {/* Desktop Navigation Links */}
          <nav className="header-nav">
            <Link 
              href="/about-me"
              className={isTransparent && isHomePage ? 'text-white' : 'text-[#0F172A]'}
            >
              About Me
            </Link>
            <Link
              href="/product/screentimejourney"
              className={isTransparent && isHomePage ? 'text-white' : 'text-[#0F172A]'}
            >
              Start Now
            </Link>
            <Link 
              href="/milestones"
              className={isTransparent && isHomePage ? 'text-white' : 'text-[#0F172A]'}
            >
              Milestones
            </Link>
            <Link 
              href="/leaderboard"
              className={isTransparent && isHomePage ? 'text-white' : 'text-[#0F172A]'}
            >
              Leaderboard
            </Link>
          </nav>

          {/* Desktop actions */}
          <div className="header-actions">
            <div className="header-buttons-desktop">
              {userAuthenticated ? (
                <>
                  <Link
                    className={`btn-primary ${isTransparent && isHomePage ? 'btn-inverted-primary' : ''}`}
                    href={AUTH_CONFIG.DASHBOARD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Dashboard
                  </Link>
                  <button
                    className={`btn-outline-secondary ${isTransparent && isHomePage ? 'btn-inverted-secondary' : ''}`}
                    onClick={logout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    className={`btn-primary ${isTransparent && isHomePage ? 'btn-inverted-primary' : ''}`}
                    href="/product/screentimejourney"
                  >
                    Start Now
                  </Link>
                  <Link
                    className={`btn-outline-secondary ${isTransparent && isHomePage ? 'btn-inverted-secondary' : ''}`}
                    href="/signin"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
