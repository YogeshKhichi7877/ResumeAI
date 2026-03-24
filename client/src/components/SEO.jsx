import { useEffect } from 'react';

/**
 * SEO Component — no react-helmet-async needed
 * Directly manipulates document head for meta tags
 * Usage: <SEO title="..." description="..." />
 */
export const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = 'https://resumelens.me/og-image.png',
  ogType = 'website',
  noIndex = false,
}) => {
  useEffect(() => {
    const siteName = 'ResumeLens';
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — AI Resume Analyser for Indian Job Seekers`;
    const finalDesc = description || 'ResumeLens is an AI-powered resume analyser built for Indian job seekers. Get ATS scores, cover letters, JD matching, cold emails & mock interview prep — free.';
    const finalKeywords = keywords || 'resume analyser India, ATS resume checker, AI resume builder, resume score, job application India, cover letter generator, resume tips for freshers';
    const finalCanonical = canonical || window.location.href;

    // Title
    document.title = fullTitle;

    const setMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Basic SEO
    setMeta('description', finalDesc);
    setMeta('keywords', finalKeywords);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    setMeta('author', 'ResumeLens');
    setMeta('language', 'English');
    setMeta('revisit-after', '7 days');

    // Open Graph (Facebook, WhatsApp, LinkedIn)
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', finalDesc, true);
    setMeta('og:type', ogType, true);
    setMeta('og:url', finalCanonical, true);
    setMeta('og:image', ogImage, true);
    setMeta('og:image:width', '1200', true);
    setMeta('og:image:height', '630', true);
    setMeta('og:site_name', siteName, true);
    setMeta('og:locale', 'en_IN', true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', finalDesc);
    setMeta('twitter:image', ogImage);

    // Canonical URL
    setLink('canonical', finalCanonical);
  }, [title, description, keywords, canonical, ogImage, ogType, noIndex]);

  return null;
};