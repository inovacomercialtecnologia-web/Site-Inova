import React from 'react';
import { motion } from 'motion/react';

const platforms = [
  "SAP", "Salesforce", "Oracle", "Totvs", "RD Station", 
  "Zapier", "Make", "Slack", "AWS", "Google Cloud", "Azure", "Power BI",
  "Tableau", "Monday.com", "Jira", "HubSpot", "Stripe", "Shopify", 
  "VTEX", "NetSuite", "Microsoft Teams", "Pagar.me"
];

const PlatformScrollBanner = () => {
  // Duplicate the list multiple times to ensure a seamless loop on all screens
  const duplicatedPlatforms = [...platforms, ...platforms, ...platforms];

  return (
    <div className="bg-[#FFFFFF] py-8 md:py-12 border-y border-gray-100 overflow-hidden relative z-30">
      <div className="flex relative">
        <motion.div 
          className="flex whitespace-nowrap gap-6 sm:gap-8 md:gap-32 items-center"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{ 
            repeat: Infinity, 
            duration: 40, 
            ease: "linear" 
          }}
        >
          {duplicatedPlatforms.map((platform, i) => (
            <div 
              key={i} 
              className="text-gray-200 text-base sm:text-xl md:text-4xl font-light tracking-tight hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#C9A84C] hover:to-[#E5C05C] transition-all duration-700 cursor-default select-none"
            >
              {platform}
            </div>
          ))}
        </motion.div>
        
        {/* Gradient masks for smooth edges */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#FFFFFF] to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#FFFFFF] to-transparent z-10"></div>
      </div>
    </div>
  );
};

export default PlatformScrollBanner;
