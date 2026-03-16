import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageMetaProps {
  title: string;
  description: string;
}

export default function PageMeta({ title, description }: PageMetaProps) {
  const location = useLocation();

  useEffect(() => {
    document.title = `${title} | Inova Systems Solutions`;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', `${title} | Inova Systems Solutions`);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', `https://inovasystemssolutions.com${location.pathname}`);

    const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (link) link.href = `https://inovasystemssolutions.com${location.pathname}`;
  }, [title, description, location.pathname]);

  return null;
}
