import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Linkedin, Mail, Share2, Instagram, Facebook } from 'lucide-react';

const XIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
  </svg>
);

export default function SocialSidebar() {
  const location = useLocation();
  const shareUrl = typeof window !== 'undefined' ? window.location.origin + location.pathname : '';
  const title = "Inova Systems Solutions - Transformação Digital Estratégica";

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-[#0077b5]'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: `https://www.instagram.com/inova_systems_solutions/`,
      color: 'hover:text-[#E4405F]'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-[#1877F2]'
    },
    {
      name: 'X',
      icon: XIcon,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
      color: 'hover:text-white'
    },
    {
      name: 'E-mail',
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-[#EA4335]'
    },
    {
      name: 'Compartilhar',
      icon: Share2,
      href: '#',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        if (navigator.share) {
          navigator.share({ title, url: shareUrl }).catch(console.error);
        } else {
          navigator.clipboard.writeText(shareUrl);
          alert('Link copiado para a área de transferência!');
        }
      },
      color: 'hover:text-[#A6864A]'
    }
  ];

  return (
    <>
      {/* Desktop Sidebar (Left) */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-[90] hidden lg:flex flex-col items-center gap-4 p-3.5 bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        {/* Vertical Text */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-[7px] font-bold uppercase tracking-[0.3em] text-white/50 [writing-mode:vertical-lr] rotate-180 select-none">
            Compartilhar
          </span>
          <div className="w-[1px] h-6 bg-white/10"></div>
        </div>

        {/* Social Icons */}
        <div className="flex flex-col gap-4">
          {socialLinks.map((social) => (
            <motion.a
              key={social.name}
              href={social.href}
              onClick={social.onClick}
              target={social.href !== '#' ? "_blank" : undefined}
              rel={social.href !== '#' ? "noopener noreferrer" : undefined}
              whileHover={{ scale: 1.15, x: 2 }}
              className={`text-white/60 ${social.color} transition-all duration-300 group relative`}
              title={social.name}
            >
              <social.icon className="w-4 h-4" strokeWidth={1.5} />
              
              {/* Tooltip */}
              <span className="absolute left-full ml-5 px-2.5 py-1 bg-black backdrop-blur-md text-white text-[8px] uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap border border-white/10 translate-x-[-8px] group-hover:translate-x-0">
                {social.name}
              </span>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Mobile Share Bar — hidden to avoid overlapping CTAs and content */}
      {/* Share functionality is available via the native share button on mobile browsers */}
    </>
  );
}
