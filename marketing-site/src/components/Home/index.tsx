import React from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import BestSeller from "./BestSeller";
import CounDown from "./Countdown";
import Testimonials from "./Testimonials";
import Newsletter from "../Common/Newsletter";
import ScrollingBanner from "../Common/ScrollingBanner";
import Separator from "../Common/Separator";
import ImageWithText from "../Common/ImageWithText";
import MilestonesPreview from "../Common/MilestonesPreview";
import LeaderboardPreview from "../Common/LeaderboardPreview";
import Footer from "../Common/Footer";

const Home = () => {
  return (
    <main>
      <Hero />
      <ScrollingBanner 
        items={[
          { text: "⏳" },
          { text: "The average person spends 7+ hours daily on screens" },
          { text: "🚫" },
          { text: "80% of phone checks are unconscious habits" },
          { text: "🧠" },
          { text: "Social media triggers dopamine addiction" },
          { text: "✨" },
          { text: "Digital wellness starts with awareness" },
          { text: "💪" },
          { text: "Take control of your screen time today" },
        ]}
        animationDuration={90}
        pauseOnHover={true}
        direction="left"
        backgroundColor="#f9f9f9"
        textColor="#1a1a1a"
        gap={12}
      />
      <Separator paddingTop="10px" paddingBottom="40px" />
      <ImageWithText 
        title="SCREEN TIME JOURNEY ©"
        subtitle="About me"
        description="I built Screen Time Journey to help you break free from endless scrolling, porn, reset your dopamine, and take back control of your focus + energy."
        imageUrl="https://cdn.shopify.com/s/files/1/0866/6749/3623/files/stj_founder_image.webp?v=1762952871"
        imageAlt="Screen Time Journey About Me"
        layout="image_first"
        imageSize="medium"
        contentPosition="middle"
        primaryButtonText="Read my story"
        primaryButtonLink="/about-me"
        secondaryButtonText="Start now"
        secondaryButtonLink="/product/screentimejourney"
      />
      <Separator />
      
      {/* Milestones Preview Section */}
      <div className="section-header">
        <div className="page-width">
          <div className="section-header-content">
            <p className="section-badge">SCREEN TIME JOURNEY ©</p>
            <h2 className="section-title">The Milestones</h2>
          </div>
        </div>
      </div>
      <MilestonesPreview />
      
      <Separator />
      
      {/* Leaderboard Preview Section */}
      <div className="section-header">
        <div className="page-width">
          <div className="section-header-content">
            <p className="section-badge">SCREEN TIME JOURNEY ©</p>
            <h2 className="section-title">The Leaderboard</h2>
          </div>
        </div>
      </div>
      <LeaderboardPreview />
      
      <Separator />
      <Footer />
    </main>
  );
};

export default Home;
