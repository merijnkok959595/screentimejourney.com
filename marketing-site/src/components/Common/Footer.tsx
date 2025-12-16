import React from 'react';
import Link from 'next/link';
import FooterCurrencySelector from './FooterCurrencySelector';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        {/* Logo and Contact Column */}
        <div className="footer-column footer-logo-column">
          <Link href="/">
            <img 
              src="https://cdn.shopify.com/s/files/1/0866/6749/3623/files/stj_footer_v2.png?v=1757876933" 
              alt="Screen Time Journey Logo" 
              className="footer-logo"
            />
          </Link>
          <div className="footer-contact">
            <a href="mailto:info@screentimejourney.com" className="footer-contact-link">info@screentimejourney.com</a>
            <a href="tel:+31649232152" className="footer-contact-link">+31 6 49232152</a>
            <div className="footer-address">Linnaeusstraat 35F-14, Amsterdam, Netherlands</div>
          </div>
        </div>

        {/* About Menu Column */}
        <div className="footer-column">
          <h4 className="footer-title">About</h4>
          <div className="footer-links">
            <Link className="footer-link" href="/faq">FAQ</Link>
            <Link className="footer-link" href="/contact">Contact</Link>
            <Link className="footer-link" href="/about-me">About Me</Link>
            <Link className="footer-link" href="/milestones">Milestones</Link>
            <Link className="footer-link" href="/leaderboard">Leaderboard</Link>
            <Link className="footer-link" href="/job-opportunities">Job Opportunities</Link>
          </div>
        </div>

        {/* Blog Posts Menu Column */}
        <div className="footer-column">
          <h4 className="footer-title">Blog Posts</h4>
          <div className="footer-links">
            <Link className="footer-link" href="/blog/why-quitting-porn-is-the-key-to-digital-freedom">Why Quitting Porn Is the ...</Link>
            <Link className="footer-link" href="/blog/dopamine-reset-how-to-break-free">The Dopamine Reset: How to Break ...</Link>
            <Link className="footer-link" href="/blog/from-screen-addiction-to-freedom">From Screen Addiction to Freedom ...</Link>
            <Link className="footer-link" href="/blog/10-proven-strategies-build-discipline">10 Proven Strategies to Build Discipline ...</Link>
            <Link className="footer-link" href="/blog/how-to-take-control-screen-time">How to Take Control of Your Screen Time ...</Link>
          </div>
        </div>
      </div>

      {/* Footer Bottom - Policies */}
      <div className="container footer-bottom">
        {/* Currency Selector */}
        <div className="footer-currency-section" style={{ display: 'flex', justifyContent: 'center', paddingBottom: '1rem', borderBottom: '1px solid #e5e5e5', marginBottom: '1rem' }}>
          <FooterCurrencySelector />
        </div>
        
        <div className="footer-policies">
          <span>2025, SCREENTIMEJOURNEY ©</span>
          <div className="footer-policy-links">
            <Link href="/privacy_policy" className="footer-policy-link">Privacy policy</Link>
            <Link href="/terms_of_service" className="footer-policy-link">Terms of service</Link>
            <Link href="/refund_policy" className="footer-policy-link">Refund policy</Link>
            <Link href="/shipping_policy" className="footer-policy-link">Shipping policy</Link>
            <Link href="/cookie_preferences" className="footer-policy-link">Cookie preferences</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


