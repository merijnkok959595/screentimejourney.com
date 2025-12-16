"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import GlobalCurrencySelector from "./GlobalCurrencySelector";

interface Announcement {
  text: string;
  link?: string;
}

interface AnnouncementBarProps {
  announcements?: Announcement[];
  enableAutoplay?: boolean;
  autoplaySpeed?: number; // in seconds
  enableLoop?: boolean;
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  announcements = [
    { text: "🧠 Reset your dopamine", link: "/product/screentimejourney" },
    { text: "🚀 Start your journey today", link: "/product/screentimejourney" },
    { text: "🛌 Wake up & sleep Phone-free", link: "/product/screentimejourney" },
    { text: "⚡ Break free from porn", link: "/product/screentimejourney" },
    { text: "⏳ Take your time back", link: "/product/screentimejourney" },
    { text: "☠️ Stop doomscrolling", link: "/product/screentimejourney" },
  ],
  enableAutoplay = true,
  autoplaySpeed = 5,
  enableLoop = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [countrySelectorOpen, setCountrySelectorOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("Netherlands");
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const countrySelectorRef = useRef<HTMLDivElement>(null);

  // Auto-rotate announcements
  useEffect(() => {
    if (!enableAutoplay || isPaused || announcements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (enableLoop) {
          return (prevIndex + 1) % announcements.length;
        } else {
          return prevIndex < announcements.length - 1 ? prevIndex + 1 : prevIndex;
        }
      });
    }, autoplaySpeed * 1000);

    return () => clearInterval(interval);
  }, [enableAutoplay, autoplaySpeed, enableLoop, announcements.length, isPaused]);

  // Close country selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countrySelectorRef.current &&
        !countrySelectorRef.current.contains(event.target as Node)
      ) {
        setCountrySelectorOpen(false);
      }
    };

    if (countrySelectorOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [countrySelectorOpen]);

  const currentAnnouncement = announcements[currentIndex];

  if (!currentAnnouncement) return null;

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const socialLinks = [
    {
      name: "Facebook",
      href: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon--svg facebook-svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-instagram"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M13.23 3.492c-.84-.037-1.096-.046-3.23-.046-2.144 0-2.39.01-3.238.055-.776.027-1.195.164-1.487.273a2.4 2.4 0 0 0-.912.593 2.5 2.5 0 0 0-.602.922c-.11.282-.238.702-.274 1.486-.046.84-.046 1.095-.046 3.23s.01 2.39.046 3.229c.004.51.097 1.016.274 1.495.145.365.319.639.602.913.282.282.538.456.92.602.474.176.974.268 1.479.273.848.046 1.103.046 3.238.046s2.39-.01 3.23-.046c.784-.036 1.203-.164 1.486-.273.374-.146.648-.329.921-.602.283-.283.447-.548.602-.922.177-.476.27-.979.274-1.486.037-.84.046-1.095.046-3.23s-.01-2.39-.055-3.229c-.027-.784-.164-1.204-.274-1.495a2.4 2.4 0 0 0-.593-.913 2.6 2.6 0 0 0-.92-.602c-.284-.11-.703-.237-1.488-.273ZM6.697 2.05c.857-.036 1.131-.045 3.302-.045a63 63 0 0 1 3.302.045c.664.014 1.321.14 1.943.374a4 4 0 0 1 1.414.922c.41.397.728.88.93 1.414.23.622.354 1.279.365 1.942C18 7.56 18 7.824 18 10.005c0 2.17-.01 2.444-.046 3.292-.036.858-.173 1.442-.374 1.943-.2.53-.474.976-.92 1.423a3.9 3.9 0 0 1-1.415.922c-.51.191-1.095.337-1.943.374-.857.036-1.122.045-3.302.045-2.171 0-2.445-.009-3.302-.055-.849-.027-1.432-.164-1.943-.364a4.15 4.15 0 0 1-1.414-.922 4.1 4.1 0 0 1-.93-1.423c-.183-.51-.329-1.085-.365-1.943C2.009 12.45 2 12.167 2 10.004c0-2.161 0-2.435.055-3.302.027-.848.164-1.432.365-1.942a4.4 4.4 0 0 1 .92-1.414 4.2 4.2 0 0 1 1.415-.93c.51-.183 1.094-.33 1.943-.366Zm.427 4.806a4.105 4.105 0 1 1 5.805 5.805 4.105 4.105 0 0 1-5.805-5.805m1.882 5.371a2.668 2.668 0 1 0 2.042-4.93 2.668 2.668 0 0 0-2.042 4.93m5.922-5.942a.958.958 0 1 1-1.355-1.355.958.958 0 0 1 1.355 1.355"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-youtube"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M18.16 5.87c.34 1.309.34 4.08.34 4.08s0 2.771-.34 4.08a2.13 2.13 0 0 1-1.53 1.53c-1.309.34-6.63.34-6.63.34s-5.321 0-6.63-.34a2.13 2.13 0 0 1-1.53-1.53c-.34-1.309-.34-4.08-.34-4.08s0-2.771.34-4.08a2.17 2.17 0 0 1 1.53-1.53C4.679 4 10 4 10 4s5.321 0 6.63.34a2.17 2.17 0 0 1 1.53 1.53M8.3 12.5l4.42-2.55L8.3 7.4z" />
        </svg>
      ),
    },
  ];

  const countries = [
    { code: "NL", name: "Netherlands", currency: "EUR", symbol: "€" },
    { code: "US", name: "United States", currency: "USD", symbol: "$" },
    { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£" },
    { code: "DE", name: "Germany", currency: "EUR", symbol: "€" },
    { code: "FR", name: "France", currency: "EUR", symbol: "€" },
  ];

  const handleCountrySelect = (country: typeof countries[0]) => {
    setSelectedCountry(country.name);
    setSelectedCurrency(country.currency);
    setCountrySelectorOpen(false);
  };

  return (
    <div
      className="announcement-bar bg-[#2E0456] h-[42px] flex items-center text-white sticky top-0 z-[100] transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-[1200px] mx-auto px-6 w-full">
        {/* Desktop: 3-column layout */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:items-center lg:w-full">
                 {/* Left: Social Media Icons - Hidden on mobile */}
                 <div className="announcement-left hidden lg:flex items-center gap-2.5 justify-start ml-8">
                   <ul className="list-unstyled flex items-center gap-2.5">
              {socialLinks.map((social, index) => (
                <li key={index} className="list-social__item">
                  <a
                    href={social.href}
                    className="link list-social__link flex items-center justify-center h-[3.8rem] px-3.2 hover:opacity-80 transition-opacity"
                    aria-label={social.name}
                  >
                    <span className="svg-wrapper flex items-center justify-center w-5 h-5">
                      {social.icon}
                    </span>
                    <span className="sr-only">{social.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Center: Announcement Message */}
          <div className="announcement-center flex items-center justify-center relative">
            {currentAnnouncement.link ? (
              <Link
                href={currentAnnouncement.link}
                className="announcement-link flex items-center justify-center gap-2 group hover:opacity-90 transition-opacity"
              >
                <p
                  className="announcement-message text-base font-normal tracking-[1px]"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  <span>{currentAnnouncement.text}</span>
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="icon icon-arrow w-3.5 h-2.5 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 14 10"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M8.537.808a.5.5 0 0 1 .817-.162l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 1 1-.708-.708L11.793 5.5H1a.5.5 0 0 1 0-1h10.793L8.646 1.354a.5.5 0 0 1-.109-.546"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            ) : (
              <p
                className="announcement-message text-base font-normal tracking-[1px]"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                <span>{currentAnnouncement.text}</span>
              </p>
            )}
          </div>

          {/* Right: Global Country/Currency Selector - Hidden on mobile */}
          <div className="announcement-right hidden lg:flex items-center justify-end">
            <GlobalCurrencySelector />
          </div>
        </div>

        {/* Mobile: Single column - only announcement (social and country hidden) */}
        <div className="lg:hidden flex items-center justify-center w-full">
          {currentAnnouncement.link ? (
            <Link
              href={currentAnnouncement.link}
              className="announcement-link flex items-center justify-center gap-1.5 group"
            >
              <p
                className="announcement-message text-xs font-normal tracking-[0.5px]"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                <span>{currentAnnouncement.text}</span>
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="icon icon-arrow w-2.5 h-2"
                viewBox="0 0 14 10"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M8.537.808a.5.5 0 0 1 .817-.162l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 1 1-.708-.708L11.793 5.5H1a.5.5 0 0 1 0-1h10.793L8.646 1.354a.5.5 0 0 1-.109-.546"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          ) : (
            <p
              className="announcement-message text-xs font-normal tracking-[0.5px]"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              <span>{currentAnnouncement.text}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;

