"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import HomeHeader from "../../components/Header";
import DefaultHeader from "../../components/Common/DefaultHeader";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import AnnouncementBar from "@/components/Common/AnnouncementBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(false); // Removed loading spinner
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <title>SCREENTIMEJOURNEY</title>
        <meta name="description" content="Break free from digital addiction and reclaim your focus with Screen Time Journey" />
        <link rel="icon" href="/favicon.ico" />
        {/* ULTRA-EARLY Mobile Logo Animation Prevention */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Ultra-early prevention - runs immediately in head
              (function() {
                'use strict';
                
                // Override classList.add globally for logo elements
                const originalAdd = Element.prototype.classList.add;
                Element.prototype.classList.add = function(...classes) {
                  // If this is a logo on mobile, filter out animation classes
                  if (window.innerWidth <= 1024 && 
                      this.classList.contains('header-logo')) {
                    const filteredClasses = classes.filter(className => 
                      !className.includes('logo-animate-shrink') && 
                      !className.includes('logo-animate-grow')
                    );
                    if (filteredClasses.length > 0) {
                      originalAdd.apply(this, filteredClasses);
                    }
                    if (classes.length !== filteredClasses.length) {
                      console.log('🛡️ ULTRA-EARLY: Blocked logo animation class at source');
                    }
                  } else {
                    originalAdd.apply(this, classes);
                  }
                };
                
                console.log('🛡️ ULTRA-EARLY: Logo animation prevention loaded in head');
              })();
            `
          }}
        />
      </head>
      <body>
        {/* AGGRESSIVE Mobile Header Logo Animation Fix */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                'use strict';
                
                function isMobile() { return window.innerWidth <= 1024; }
                
                function removeLogoAnimations() {
                  if (isMobile()) {
                    const logos = document.querySelectorAll('.header-logo');
                    logos.forEach(logo => {
                      const hadClasses = logo.classList.contains('logo-animate-shrink') || logo.classList.contains('logo-animate-grow');
                      if (hadClasses) {
                        logo.classList.remove('logo-animate-shrink', 'logo-animate-grow');
                        logo.style.animation = 'none !important';
                        // Don't override transform for mobile grid layout - only reset if it was set by animations
                        if (logo.style.transform && (logo.style.transform.includes('scale') || logo.style.transform.includes('translate'))) {
                          logo.style.transform = '';
                        }
                        console.log('🚫 AGGRESSIVE: Removed logo animation classes on mobile (preserving grid layout)');
                      }
                    });
                  }
                }
                
                // Run continuously and aggressively
                let intervalId;
                function startAggressiveMode() {
                  if (isMobile()) {
                    // Run every 50ms to catch any attempts to add animation classes
                    intervalId = setInterval(removeLogoAnimations, 50);
                    console.log('🔥 AGGRESSIVE MODE: Started continuous logo animation removal');
                  } else if (intervalId) {
                    clearInterval(intervalId);
                    console.log('🔥 AGGRESSIVE MODE: Stopped (desktop detected)');
                  }
                }
                
                function resetScrollingBanner() {
                  // Animation stacking fix: Let React component handle all animations
                  // This function is now disabled to prevent multiple animation timers
                  console.log('🎬 Scrolling banner animation now handled by React component (prevents stacking)');
                }
                
                // Immediate execution
                removeLogoAnimations();
                resetScrollingBanner();
                startAggressiveMode();
                
                // Ultra-fast mutation observer
                const observer = new MutationObserver(function(mutations) {
                  if (!isMobile()) return;
                  
                  let needsCleanup = false;
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                      const target = mutation.target;
                      if (target.classList && target.classList.contains('header-logo')) {
                        if (target.classList.contains('logo-animate-shrink') || 
                            target.classList.contains('logo-animate-grow')) {
                          needsCleanup = true;
                        }
                      }
                    }
                  });
                  
                  if (needsCleanup) {
                    // Immediate cleanup
                    removeLogoAnimations();
                    console.log('⚡ ULTRA-FAST: Blocked animation class via MutationObserver');
                  }
                });
                
                // Start observing everything
                function startObserving() {
                  // Watch the entire document for changes
                  observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class']
                  });
                  
                  // Also watch individual logos
                  const logos = document.querySelectorAll('.header-logo');
                  logos.forEach(logo => {
                    observer.observe(logo, { 
                      attributes: true, 
                      attributeFilter: ['class'] 
                    });
                  });
                }
                
                // Initialize observers
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', startObserving);
                } else {
                  startObserving();
                }
                
                // Aggressive scroll listener
                window.addEventListener('scroll', function() {
                  if (isMobile()) {
                    removeLogoAnimations(); // Run on every scroll event
                  }
                }, { passive: true });
                
                // Window resize handler
                let resizeTimer;
                window.addEventListener('resize', function() {
                  clearTimeout(resizeTimer);
                  resizeTimer = setTimeout(function() {
                    startAggressiveMode(); // Restart aggressive mode based on new screen size
                  }, 100);
                });
                
                console.log('✅ AGGRESSIVE Mobile logo animation interceptor loaded');
              })();
            `
          }}
        />
        
          <>
            <ReduxProvider>
              <CartModalProvider>
                <ModalProvider>
                  <PreviewSliderProvider>
                    <AnnouncementBar />
                    {isHomePage ? <HomeHeader /> : <DefaultHeader />}
                    {children}

                    <QuickViewModal />
                    <CartSidebarModal />
                    <PreviewSliderModal />
                    </PreviewSliderProvider>
                  </ModalProvider>
                </CartModalProvider>
            </ReduxProvider>
            </>
      </body>
    </html>
  );
}
